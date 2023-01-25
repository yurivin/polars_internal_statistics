export const LOCATION_NETWORK_ID = 137

export const CHECKED_STABLE = {
    97: 'BUSD',
    80001: 'pUSDT',
    137: 'USDC',
    128: 'PUSD',
    256: 'HUSD',
}
export const COLLATERAL_IMAGE = {
    97: 'BUSD.svg',
    80001: 'PUSDT.svg',
    137: 'USDC.svg',
    128: 'HUSD.svg',
    256: 'HUSD.svg',
}
export const SECOND_COLLATERAL_IMAGE = {
    97: 'POL.svg',
    80001: 'POL.svg',
    137: 'POL.svg',
    128: 'POL.svg',
    256: 'POL.svg',
}
export const COLLATERAL_TOKEN_SYMBOL = {
    97: 'BUSD',
    80001: 'pUSDT',
    137: 'USDC',
    128: 'PUSD',
    256: 'HUSD',
}
export const DEFAULT_NETWORK = {
    97: 'binance',
    80001: 'polygon',
    137: 'polygon',
    128: 'heco',
    256: 'heco',
}
export const DEFAULT_NETWORK_NAME = {
    97: 'BSC Testnet',
    80001: 'Polygon Testnet',
    137: 'Polygon',
    128: 'Heco',
    256: 'Heco Testnet',
}
export const DEFAULT_COLLATERAL_TOKEN = {
    97: 'tPol',
    80001: 'pUSDT',
    137: 'USDC',
    128: 'PUSD',
    256: 'HUSD',
}
export const DEFAULT_EVENTS_REQUESTS_SIZE = {
    97: 1000,
    80001: 1000,
    128: 1000,
    256: 300,
    137: 500,
}

export const DEFAULT_SCAN_LINK = {
    80001: 'https://api-testnet.polygonscan.com/api',
    97: 'https://api-testnet.bscscan.com/api',
    137: 'https://api.polygonscan.com/api',
    128: 'https://api-testnet.hecoinfo.com/api',
    256: 'https://api.hecoinfo.com/api',
}

export const DEFAULT_SCAN_LINK_BLOCKCHAIN_ADDRESS = {
    97: 'https://testnet.bscscan.com/address/',
    80001: 'https://mumbai.polygonscan.com/address/',
    137: 'https://polygonscan.com/address/',
}

export const DEFAULT_SCAN_LINK_BLOCKCHAIN_TX = {
    97: 'https://testnet.bscscan.com/tx/',
    80001: 'https://mumbai.polygonscan.com/tx/',
    137: 'https://polygonscan.com/tx/',
}

export const timeOutApi = 6000

export const isSuitesVisibles = false
// isSuitesVisibles === true - both types of suites available
// isSuitesVisibles === false - only original type of suites available
// isSuitesVisibles === null - only custom type of suites available
