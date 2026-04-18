import { Actor, log } from 'apify';
import {
    EIP_NAMES,
    SOLANA,
    TRON,
    NET_ALIAS,
    ASSETS,
    NAME_FALLBACK,
    SOLANA_MINTS,
    GATEWAY_WALLETS,
} from './constants.js';

const CONCURRENCY = 15;
const TIMEOUT_MS  = 15_000;
const PUSH_BATCH  = 100;

function resolveNetwork(raw) {
    if (!raw) return null;
    if (EIP_NAMES[raw]) return EIP_NAMES[raw];
    if (raw.startsWith('solana:')) return SOLANA[raw.slice(7)] ?? 'Solana';
    if (raw.startsWith('tron:'))   return TRON[raw.slice(5)] ?? 'Tron';
    return NET_ALIAS[String(raw).toLowerCase()] ?? raw;
}

function normalizeAccept(e) {
    const network = resolveNetwork(e.network ?? null);
    const assetLc = e.asset ? String(e.asset).toLowerCase() : null;
    let hit = assetLc ? ASSETS.get(`${network}:${assetLc}`) : null;
    if (!hit && assetLc) hit = SOLANA_MINTS[assetLc] ?? null;
    if (!hit && e.extra?.verifyingContract
        && GATEWAY_WALLETS.has(String(e.extra.verifyingContract).toLowerCase())) {
        hit = ['USDC', 6];
    }
    const name   = e.extra?.name ?? null;
    const nameHit = !hit && name ? NAME_FALLBACK[String(name).toUpperCase().trim()] : null;
    const symbol = hit?.[0] ?? nameHit?.[0] ?? name ?? e.asset ?? e.currency ?? null;
    const rawAmt = e.maxAmountRequired ?? e.amount ?? e.price ?? null;
    let amount   = rawAmt == null ? null : String(rawAmt);
    const decimals = hit?.[1] ?? e.extra?.decimals ?? nameHit?.[1] ?? null;
    if (rawAmt != null && decimals != null) {
        const s = String(rawAmt).trim();
        if (/^\d+$/.test(s)) {
            const padded = s.padStart(decimals + 1, '0');
            const frac   = padded.slice(-decimals).replace(/0+$/, '');
            amount = frac ? `${padded.slice(0, -decimals)}.${frac}` : padded.slice(0, -decimals);
        }
    }
    const out = {
        scheme:  e.scheme ?? null,
        network,
        amount,
        symbol,
        payTo:   e.payTo ?? e.endpoint ?? null,
    };
    if (e.maxTimeoutSeconds != null) out.maxTimeoutSeconds = e.maxTimeoutSeconds;
    if (e.extra && typeof e.extra === 'object') {
        const { name: _n, ...rest } = e.extra;
        if (Object.keys(rest).length) out.extra = rest;
    }
    return out;
}

const HEADER_KEYS = ['payment-required','x-payment-required','www-authenticate',
                     'x402-price','x402-currency','x402-network','x402-endpoint'];

function parsePaymentDetails(hdrs, body) {
    const rawHeaders = {};
    for (const k of HEADER_KEYS) if (hdrs[k]) rawHeaders[k] = hdrs[k];

    let payload = null;
    if (hdrs['payment-required']) {
        try { payload = JSON.parse(Buffer.from(hdrs['payment-required'], 'base64').toString('utf8')); } catch {}
    }
    if (!payload && body && (body.accepts || body.paymentRequirements || body.x402Version)) payload = body;

    if (payload) {
        const raw = payload.accepts ?? payload.paymentRequirements ?? [];
        return {
            x402Version: payload.x402Version ?? null,
            description: payload.resource?.description ?? null,
            accepts:     Array.isArray(raw) ? raw.map(normalizeAccept) : [],
            rawHeaders,
        };
    }

    // Legacy header fallback
    let amount = null, symbol = null, network = null, payTo = null;
    if (hdrs['x-payment-required']) {
        try {
            const p = JSON.parse(hdrs['x-payment-required']);
            amount  = p.price ?? p.amount ?? null;
            symbol  = p.currency ?? p.asset ?? null;
            network = resolveNetwork(p.network ?? p.chain ?? null);
            payTo   = p.endpoint ?? p.paymentEndpoint ?? p.payTo ?? null;
        } catch { amount = hdrs['x-payment-required']; }
    }
    amount  ??= hdrs['x402-price'] ?? null;
    symbol  ??= hdrs['x402-currency'] ?? null;
    network ??= resolveNetwork(hdrs['x402-network'] ?? null);
    payTo   ??= hdrs['x402-endpoint'] ?? null;

    if (!amount && hdrs['www-authenticate']) {
        const m = (re) => (hdrs['www-authenticate'].match(re) || [])[1] ?? null;
        amount  ??= m(/price="?([^",\s]+)"?/i);
        symbol  ??= m(/currency="?([^",\s]+)"?/i);
        network ??= resolveNetwork(m(/network="?([^",\s]+)"?/i));
        payTo   ??= m(/endpoint="?([^",\s]+)"?/i);
    }

    const accepts = (amount || network || payTo)
        ? [{ scheme: null, network, amount: amount ? String(amount) : null, symbol, payTo }]
        : [];
    return { x402Version: null, description: null, accepts, rawHeaders };
}

async function checkUrl(url) {
    const checkedAt = new Date().toISOString();
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    try {
        const res = await fetch(url, {
            method: 'GET', redirect: 'follow',
            signal: ctrl.signal,
            headers: { 'User-Agent': 'X402Checker/1.0' },
        });
        clearTimeout(timer);
        const statusCode = res.status;
        if (statusCode !== 402) return { url, supportsX402: false, statusCode, checkedAt };

        const hdrs = Object.fromEntries(res.headers.entries());
        const text = await res.text();
        let body = null;
        if (text && text.trimStart()[0] === '{') try { body = JSON.parse(text); } catch {}

        const p = parsePaymentDetails(hdrs, body);
        const item = {
            url, supportsX402: true, statusCode,
            x402Version:    p.x402Version,
            description:    p.description,
            acceptsCount:   p.accepts.length,
            acceptNetworks: p.accepts.map(a => a.network),
            acceptAmounts:  p.accepts.map(a => a.amount),
            acceptSymbols:  p.accepts.map(a => a.symbol),
            acceptPayTos:   p.accepts.map(a => a.payTo),
            accepts:        p.accepts,
            checkedAt,
        };
        if (Object.keys(p.rawHeaders).length) item.rawHeaders = p.rawHeaders;
        return item;
    } catch (err) {
        clearTimeout(timer);
        return { url, supportsX402: false, statusCode: null,
                 error: err.name === 'AbortError' ? 'Request timed out' : err.message, checkedAt };
    }
}

Actor.main(async () => {
    const input = await Actor.getInput();
    let { urls = [] } = input ?? {};

    if (typeof urls === 'string') urls = urls.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
    else urls = urls.map(u => (typeof u === 'object' && u.url ? u.url : u));
    urls = [...new Set(urls.filter(Boolean))];
    if (!urls.length) { log.warning('No URLs provided — exiting.'); return; }

    // Budget cap
    let urlList = [...urls];
    const maxBudget = parseFloat(process.env.ACTOR_MAX_TOTAL_CHARGE_USD);
    const spent     = parseFloat(process.env.ACTOR_TOTAL_CHARGE_USD || '0');
    if (!isNaN(maxBudget) && maxBudget > 0) {
        try {
            const pricePerItem = Actor.getChargingManager().getPricingInfo()?.perEventPrices?.['apify-default-dataset-item'] ?? null;
            if (pricePerItem > 0) {
                const max = Math.floor((maxBudget - spent) / pricePerItem);
                log.info(`Budget $${maxBudget.toFixed(4)} | Remaining $${(maxBudget - spent).toFixed(4)} | Max URLs: ${max}`);
                if (max <= 0) { log.warning('No remaining budget — exiting.'); return; }
                if (max < urlList.length) { log.warning(`Capping to ${max} URLs (${urlList.length - max} dropped).`); urlList = urlList.slice(0, max); }
            }
        } catch (e) { log.warning(`Could not read pricing info: ${e.message}`); }
    }

    log.info(`Checking ${urlList.length} URL(s) for X402 support.`);

    let idx = 0;
    const buffer = [];

    const flush = async (force = false) => {
        if (buffer.length >= PUSH_BATCH || (force && buffer.length)) {
            const chunk = buffer.splice(0, buffer.length);
            await Actor.pushData(chunk);
            for (const _ of chunk) {
                try { await Actor.charge({ eventName: 'apify-default-dataset-item' }); } catch {}
            }
        }
    };

    const worker = async () => {
        while (idx < urlList.length) {
            const url = urlList[idx++];
            buffer.push(await checkUrl(url));
            await flush();
        }
    };

    await Promise.all(Array.from({ length: Math.min(CONCURRENCY, urlList.length) }, worker));
    await flush(true);
    log.info(`Done. Processed ${urlList.length} URL(s).`);
});