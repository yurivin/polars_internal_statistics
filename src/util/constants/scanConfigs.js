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
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
export const COMMISION_TOKEN_ADDRESS = {
    80001: '0x45D50e3A65FBbdC2C9b3011B76B5e77313eAa172',
    97: '0x3084f20bd972Cec3d4Ba5561B91F9761844Dcd04',
}

export const SUITE_FACTORY_ADDRESS = {
    80001: '0x6C97108046749C41d3EfE065FB4E8aC72e2be5c5',
    97: '0x6Ebb80DC1Cb4ee949262Bf2EE78B33ABcDa0F906',
    137: '0x28A764fB5eBECcf68d0Ea7Ee3eF8eb6799E347df',
}

export const SUITE_LIST_ADDRESS = {
    80001: '0x064a6a4f1F74F7A0b521bde22f050687a5901EAd',
    97: '0xf05Fe3E90ae881aC480bbe14c7AD824230a31BD2',
    137: '0x5f2D7d7bB5dB2AE909C6deA0a7E16F034D1E5f91',
}

export const PREDICTION_POOL_FACTORY_ADDRESS = {
    80001: '0x6C746EE3a28D8790cfe27C98a4b2a4cb4395db70',
    97: '0xDDE66f490AA539308DF9d28C60DD5E17B359c13D',
    137: '0x0298B5AD4e3D2215a4F6cB03BFc43C96CbB0Aa1C',
}

export const PREDICTION_COLLATERIZATION_FACTORY_ADDRESS = {
    80001: '0x902d1b0B3836D7Ab081A34E53C96Ae08fEa6102C',
    97: '0xEdFC78c254111FA73e080dc776AA78Dca86251fb',
    137: '0xCdF0795E2E606FAda59B259356c6c0101C2d0D75',
}

export const EVENT_LIFE_CYCLE_FACTORY_ADDRESS = {
    80001: '0xc8292282FB4BD8aB2aD4377D9E3C6A4b64C27034',
    97: '0x94B00becB3146c0630cebC53A65d425B8538d310',
    137: '0x27A9D3A20d2eA94C46fBf8Da2D8Cf5f00697551E',
}

export const PENDING_ORDERS_FACTORY_ADDRESS = {
    80001: '0x9EA04D36e191D4163B41FD009DAB3AbafD737c06',
    97: '0x270cA1d522c07Ebc74b3B11683E82cb435a27eCb',
    137: '0x21Eff1b3c8947F94146C34e1B89ad3a0f0A74321',
}
export const LEVERAGE_FACTORY_ADDRESS = {
    80001: '0x7b0A25E829DFAa24Fb8cE85f2C8CEB8AA06C7473',
    137: '0x0f0e40314e3bCdA2F8E076F14B9081e61c99f902',
}
export const LEVERAGE_CONTRACT_ADDRESS = {
    80001: '0xe6942caE5a35c0d96e683EAa49777ea167aae198',
    137: '0xd667f9f7948b4F671D932795f7B227E01041e839',
}
export const EVENT_LIFE_CYCLE_CONTRACT_ADDRESS = {
    80001: '0xA8Abd16ACCe49833e30b64B15EbaDB3abFB6733d',
    137: '0x95467bdF41C37adc2dd1DF887f9cAD3EDeF623e2',
}

export const timeOutApi = 5000

export const isSuitesVisibles = false
// isSuitesVisibles === true - both types of suites available
// isSuitesVisibles === false - only original type of suites available
// isSuitesVisibles === null - only custom type of suites available
