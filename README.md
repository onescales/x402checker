# X402 Checker

Check any URL — or a bulk list — to instantly discover whether it supports the **X402 HTTP payment protocol**. For every X402-enabled endpoint, the actor extracts the price, currency, network, payment address, and full structured payment options.

## What is X402?

x402 is an open standard that brings native payments to the internet. It fills the gap the web was built without — making value exchange between clients and servers as natural as any other request. The result: scalable, agentic payment economies that work for everyone.

## What does this app do?

- Sends a request to each URL
- Detects a `402 Payment Required` response
- Parses all X402-related headers and JSON body: `payment-required`, `x-payment-required`, `www-authenticate`, `x402-price`, `x402-currency`, `x402-network`, `x402-endpoint`, and more
- Handles both the modern `accepts` / `paymentRequirements` array format and legacy single-header formats
- Returns one structured dataset row per URL: payment options, networks, amounts, tokens, pay-to addresses, and error info

## Supported Networks & Coins

- **Stablecoins:** USDC, USDT, DAI, EURC, PYUSD, USDG
- **EVM mainnets:** Ethereum, Base, Polygon, Optimism, Arbitrum, Avalanche, BSC, X Layer, Plasma
- **EVM testnets:** Ethereum Sepolia, Base Sepolia, OP Sepolia, Arbitrum Sepolia, Polygon Amoy, Avalanche Fuji, X Layer Sepolia
- **Solana:** Mainnet and Devnet
- **Unknown networks and tokens** are still reported with their raw values so you never lose data
- **Need a network or coin that isn't listed?** [Contact us](https://docs.google.com/forms/d/e/1FAIpQLSfsKyzZ3nRED7mML47I4LAfNh_mBwkuFMp1FgYYJ4AkDRgaRw/viewform?usp=dialog) and we'll add it. 

## Use cases

- **Developer research** — Discover which URLs in the x402 ecosystem require payment and at what price
- **Bulk auditing** — Check hundreds of endpoints at once to build a directory or monitor pricing changes
- **Integration testing** — Verify your own x402-enabled service is returning the correct headers
- **Competitive intelligence** — Track x402 adoption across public APIs

## Input

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `urls` | array | Yes | One or more URLs to check |

**Example input:**
```json
{
    "urls": [
        { "url": "https://x402.org/protected" },
        { "url": "https://api.example.com/data" }
    ]
}
```

## Output

Each URL produces one dataset row:

| Field | Type | Description |
|-------|------|-------------|
| `url` | string | The checked URL |
| `supportsX402` | boolean | `true` if the server returned HTTP 402 |
| `statusCode` | number | Actual HTTP status code returned |
| `x402Version` | string | X402 protocol version from the payload |
| `description` | string | Resource description from the payload |
| `acceptsCount` | number | Number of payment options available |
| `acceptNetworks` | string[] | Blockchain networks for each option (e.g. `Base`, `Ethereum`) |
| `acceptAmounts` | string[] | Payment amounts for each option (human-readable, e.g. `0.001`) |
| `acceptSymbols` | string[] | Token symbols for each option (e.g. `USDC`) |
| `acceptPayTos` | string[] | Payment recipient addresses for each option |
| `accepts` | object[] | Full structured payment options array |
| `rawHeaders` | object | Raw X402-related response headers (when present) |
| `error` | string | Error message if the request failed |
| `checkedAt` | string | ISO 8601 timestamp |

**Example output item (X402-enabled URL):**
```json
{
    "url": "https://x402.org/protected",
    "supportsX402": true,
    "statusCode": 402,
    "x402Version": "1",
    "description": "Protected resource",
    "acceptsCount": 1,
    "acceptNetworks": ["Base"],
    "acceptAmounts": ["0.001"],
    "acceptSymbols": ["USDC"],
    "acceptPayTos": ["0xABC123..."],
    "accepts": [
        {
            "scheme": "exact",
            "network": "Base",
            "amount": "0.001",
            "symbol": "USDC",
            "payTo": "0xABC123..."
        }
    ],
    "checkedAt": "2025-04-16T12:00:00.000Z"
}
```

**Example output item (non-X402 URL):**
```json
{
    "url": "https://api.example.com/data",
    "supportsX402": false,
    "statusCode": 200,
    "checkedAt": "2025-04-16T12:00:00.000Z"
}
```
## Open Source

x402checker is open source and freely available for personal and commercial use.

**Repository:** [github.com/onescales/x402checker](https://github.com/onescales/x402checker)

This project is licensed under the [MIT License with Attribution](./LICENSE) — you are free to use, modify, and distribute this software, provided that visible credit to **One Scales** and a link to [https://onescales.com/](https://onescales.com/) is included in any derivative work

## Support

**[Contact Support](https://docs.google.com/forms/d/e/1FAIpQLSfsKyzZ3nRED7mML47I4LAfNh_mBwkuFMp1FgYYJ4AkDRgaRw/viewform?usp=dialog)** — feature requests and custom integrations welcome.