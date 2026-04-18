// Network and asset definitions for the X402 Checker.
// Add new chains, tokens, or aliases here without touching main.js.

export const EIP_NAMES = {
    'eip155:1':        'Ethereum',
    'eip155:8453':     'Base',
    'eip155:84532':    'Base Sepolia',
    'eip155:10':       'Optimism',
    'eip155:137':      'Polygon',
    'eip155:42161':    'Arbitrum',
    'eip155:43114':    'Avalanche',
    'eip155:56':       'BSC',
    'eip155:11155111': 'Ethereum Sepolia',
    'eip155:11155420': 'OP Sepolia',
    'eip155:421614':   'Arbitrum Sepolia',
    'eip155:80002':    'Polygon Amoy',
    'eip155:43113':    'Avalanche Fuji',
    'eip155:196':      'X Layer',
    'eip155:1952':     'X Layer Sepolia',
    'eip155:5042002':  'Plasma',
};

export const SOLANA = {
    'EtWTRABZaYq6iMfeYKouRu166VU2iaqEi8MMEtD': 'Solana Devnet',
    '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp1xzuYQz': 'Solana',
};

export const TRON = {
    '0x2b6653dc': 'Tron',
    '0xcd8690dc': 'Tron Nile',
};

// Legacy network aliases (lowercase) used by publishers instead of CAIP-2.
export const NET_ALIAS = {
    'ethereum': 'Ethereum', 'ethereum-mainnet': 'Ethereum', 'mainnet': 'Ethereum',
    'optimism': 'Optimism', 'op-mainnet': 'Optimism',
    'bsc': 'BSC', 'binance-smart-chain': 'BSC',
    'polygon': 'Polygon', 'matic': 'Polygon',
    'base': 'Base', 'base-mainnet': 'Base',
    'arbitrum': 'Arbitrum', 'arbitrum-one': 'Arbitrum',
    'avalanche': 'Avalanche', 'avalanche-c-chain': 'Avalanche', 'avax': 'Avalanche',
    'sepolia': 'Ethereum Sepolia', 'ethereum-sepolia': 'Ethereum Sepolia',
    'op-sepolia': 'OP Sepolia', 'optimism-sepolia': 'OP Sepolia',
    'base-sepolia': 'Base Sepolia',
    'arbitrum-sepolia': 'Arbitrum Sepolia',
    'polygon-amoy': 'Polygon Amoy', 'amoy': 'Polygon Amoy',
    'avalanche-fuji': 'Avalanche Fuji', 'fuji': 'Avalanche Fuji',
    'solana': 'Solana', 'solana-mainnet': 'Solana',
    'solana-devnet': 'Solana Devnet', 'devnet': 'Solana Devnet',
    'tron': 'Tron', 'tron-mainnet': 'Tron', 'tron-nile': 'Tron Nile', 'nile': 'Tron Nile',
};

// (network, asset-lowercased) -> [symbol, decimals]. Sources: developers.circle.com.
export const ASSETS = new Map(Object.entries({
    // USDC mainnets
    'Ethereum:0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48':        ['USDC', 6],
    'Optimism:0x0b2c639c533813f4aa9d7837caf62653d097ff85':        ['USDC', 6],
    'BSC:0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d':             ['USDC', 18],
    'Polygon:0x3c499c542cef5e3811e1192ce70d8cc03d5c3359':         ['USDC', 6],
    'Base:0x833589fcd6edb6e08f4c7c32d4f71b54bda02913':            ['USDC', 6],
    'Arbitrum:0xaf88d065e77c8cc2239327c5edb3a432268e5831':        ['USDC', 6],
    'Avalanche:0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e':       ['USDC', 6],
    // USDC testnets
    'Ethereum Sepolia:0x1c7d4b196cb0c7b01d743fbc6116a902379c7238':['USDC', 6],
    'OP Sepolia:0x5fd84259d66cd46123540766be93dfe6d43130d7':      ['USDC', 6],
    'Base Sepolia:0x036cbd53842c5426634e7929541ec2318f3dcf7e':    ['USDC', 6],
    'Arbitrum Sepolia:0x75faf114eafb1bdbe2f0316df893fd58ce46aa4d':['USDC', 6],
    'Polygon Amoy:0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582':    ['USDC', 6],
    'Avalanche Fuji:0x5425890298aed601595a70ab815c96711a31bc65':  ['USDC', 6],
    // USDC Solana
    'Solana:epjfwdd5aufqssqem2qn1xzybapc8g4weggkzwytdt1v':        ['USDC', 6],
    'Solana Devnet:4zmmc9srt5ri5x14gagxhahii3gnpaeerypjgzjdncdu': ['USDC', 6],
    // EURC
    'Ethereum:0x1abaea1f7c830bd89acc67ec4af516284b1bc33c':        ['EURC', 6],
    'Base:0x60a3e35cc302bfa44cb288bc5a4f316fdb1adb42':            ['EURC', 6],
    'Avalanche:0xc891eb4cbdeff6e073e859e987815ed1505c2acd':       ['EURC', 6],
    'Ethereum Sepolia:0x08210f9170f89ab7658f0b5e3ff39b0e03c594d4':['EURC', 6],
    'Base Sepolia:0x808456652fdb597867f38412077a9182bf77359f':    ['EURC', 6],
    'Avalanche Fuji:0x5e44db7996c682e92a960b65ac713a54ad815c6b':  ['EURC', 6],
    'Solana:hzwqbkzw8hxmn6bf2yfznrht3c2ixxzpkcfu7ubedktr':        ['EURC', 6],
    // USDT / DAI
    'Ethereum:0xdac17f958d2ee523a2206206994597c13d831ec7':        ['USDT', 6],
    'Optimism:0x94b008aa00579c1307b0ef2c499ad98a8ce58e58':        ['USDT', 6],
    'BSC:0x55d398326f99059ff775485246999027b3197955':             ['USDT', 18],
    'Polygon:0xc2132d05d31c914a87c6611c10748aeb04b58e8f':         ['USDT', 6],
    'Arbitrum:0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9':        ['USDT', 6],
    'Avalanche:0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7':       ['USDT', 6],
    'Ethereum:0x6b175474e89094c44da98b954eedeac495271d0f':        ['DAI', 18],
    // TRON (TRC20) — keys lowercased to match the lookup path
    'Tron:tr7nhqjekqxgtci8q8zy4pl8otszgjlj6t':                    ['USDT', 6],
    'Tron:tekxitehnzsmse2xqrbj4w32run966rdz8':                    ['USDC', 6],
    'Tron:tpymhehy5n8tcefygqw2rpxsghsfzghpdn':                    ['USDD', 18],
    'Tron:txdk8mbtrbxeyumns83cfkpayyt8xwv9hz':                    ['USDD', 18],
}));

// Last-resort: resolve symbol/decimals from extra.name when asset address is missing or unknown.
export const NAME_FALLBACK = {
    'USDC':             ['USDC', 6],
    'USDCOIN':          ['USDC', 6],
    'USD COIN':         ['USDC', 6],
    'USD COIN (TRC20)': ['USDC', 6],
    'USDT':             ['USDT', 6],
    'TETHER':           ['USDT', 6],
    'TETHER USD':       ['USDT', 6],
    'DAI':              ['DAI',  18],
    'EURC':             ['EURC', 6],
    'PYUSD':            ['PYUSD', 6],
    'USDG':             ['USDG', 6],
    'GLOBAL DOLLAR':    ['USDG', 6],
    'USDD':             ['USDD', 18],
    'DECENTRALIZED USD':['USDD', 18],
};

// Solana mints are globally unique — safe to look up by mint alone when network mismatches.
export const SOLANA_MINTS = {
    'epjfwdd5aufqssqem2qn1xzybapc8g4weggkzwytdt1v': ['USDC', 6],
    '4zmmc9srt5ri5x14gagxhahii3gnpaeerypjgzjdncdu': ['USDC', 6],
    'hzwqbkzw8hxmn6bf2yfznrht3c2ixxzpkcfu7ubedktr': ['EURC', 6],
};

// Circle Gateway wallet contracts — balances are 1:1 USDC (6 decimals).
export const GATEWAY_WALLETS = new Set([
    '0x77777777dcc4d5a8b6e418fd04d8997ef11000ee', // EVM mainnet
    '0x0077777d7eba4688bdef3e311b846f25870a19b9', // EVM testnet
]);