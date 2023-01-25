import Web3 from 'web3'
import WalletConnectProvider from '@walletconnect/web3-provider'
import detectEthereumProvider from '@metamask/detect-provider'
import {
  PLATFORM_CONFIG,
  LOCATION_NETWORK_ID,
} from './constants/mergeVariables'
import ContractInstance from './ContractInstance'
import COLLATERAL_ABI from '@/util/constants/contractsABI/usdcToken.json'

if (location.protocol === 'http:' && process.env.NODE_ENV === 'production') {
  location.replace(`https:${location.href.substring(location.protocol.length)}`)
}
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
}
export const walletProvider = new WalletConnectProvider({
  rpc: {
    97: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
    // 56: "https://bsc-dataseed.binance.org/"
  },
  // infuraId: "f3b08a2fda554cb8bc5dcb5da5d19a5c",
  // infuraId: "6646c492156342c0af40bee32474eab0",
  bridge: 'https://events-bsc.polars.io/ws/',
  // bridge: "https://bridge.aktionariat.com:8887",

  // infuraId: "da3e2274877346d7a04ff4cdb2930f74",
})

export async function connect() {
  try {
    return await window.ethereum.enable()
  } catch (error) {
    console.error(error)
  }
}

export async function getAccount() {
  const address = await getAddress()
  if (address) {
    try {
      const web3Instance = checkAndInstantiateWeb3()
      const balance = await getBalance(web3Instance, address)

      return { address, balance }
    } catch (error) {
      console.error(error)
    }
  } else {
    throw new Error('Unable to connect to Metamask')
  }
}

export async function getAddress() {
  if (localStorage.provider) {
    try {
      const provider = await detectEthereumProvider()
      return (await provider.request({ method: 'eth_accounts' }))[0]
    } catch (e) {
      console.error(e)
      return null
    }
  } else if (localStorage.walletconnect) {
    try {
      return walletProvider.wc.accounts[0]
    } catch (e) {
      console.error(e)
      return null
    }
  } else {
    return null
  }
}

export async function getNetworkId() {
  let networkID
  if (!isMobile()) {
    const provider = await detectEthereumProvider()
    networkID = await provider.request({ method: 'net_version' })
    if (await localStorage.walletconnect) {
      networkID = walletProvider.wc.chainId
    }
  } else {
    if (localStorage.provider) {
      const provider = await detectEthereumProvider()
      networkID = await provider.request({ method: 'net_version' })
    }
    if (await localStorage.walletconnect) {
      networkID = walletProvider.wc.chainId
    }
  }

  return networkID
}

// export async function getPlatformName() {
//   return (await localStorage.colleteralName) == 'BUSD'
//     ? (localStorage.platformName = 'mixed')
//     : (localStorage.platformName = 'Mixed')
// }

export async function getPlatformId() {
  if (sessionStorage.platformId) {
    return await sessionStorage.platformId
  } else {
    return await localStorage.platformId
  }
}

export async function getPlatformLiqudity(address, colAddress) {
  console.log('colAddress', colAddress)
  console.log('address', address)
  const COLLATERAL = new ContractInstance(COLLATERAL_ABI, colAddress)
  const balance = await COLLATERAL.balanceOf(address)
  return balance.data
}

export async function getPlatformDecimals(colAddress) {
  const COLLATERAL = new ContractInstance(COLLATERAL_ABI, colAddress)
  const decimals = await COLLATERAL.decimals()
  return decimals.data
}

export async function getPlatformIdForEvent(platformId) {
  // console.log(platformId)
  return platformId
}

// export async function getPlatformNameAddEvent(token) {
//   return (await token) == 'BUSD' ? 'mixed' : 'Mixed'
// }

export async function getColleteralName() {
  // console.log(localStorage.colleteralName)
  return await sessionStorage.colleteralName
}

export async function getApiUrl(token) {
  let networkId = LOCATION_NETWORK_ID
  const currentPlatform = PLATFORM_CONFIG[networkId].params.find(
    (item) => item.collateral.toLowerCase() == token.toLowerCase()
  )
  const { title } = PLATFORM_CONFIG[networkId].params.find(
    (item) => item.platformId == sessionStorage.platformId
  )
  // console.log('title', title)
  return networkId + '-' + currentPlatform.collateral + '-' + title
}

export async function getApiUrlForEvent(platformId) {
  let networkId = LOCATION_NETWORK_ID
  const currentPlatform = PLATFORM_CONFIG[networkId].params.find(
    (item) => item.platformId == platformId
  )
  return (
    networkId + '-' + currentPlatform.collateral + '-' + currentPlatform.title
  )
}

export async function enableWallet() {
  try {
    await walletProvider.enable()
  } catch (error) {
    window.location.reload()
    console.error(error)
  }
}

// if (
//   window.ethereum === undefined &&
//   window.screen.width <= 992 &&
//   walletProvider.accounts.length <= 0
// ) {
//   enableWallet();
// }

// Web3 - класс, который мы импортировали с библиотекой web3
export function checkAndInstantiateWeb3() {
  try {
    if (localStorage.provider) {
      return new Web3(window.ethereum)
    } else if (localStorage.walletconnect) {
      return new Web3(walletProvider)
    } else {
      return new Web3(window.ethereum)
    }
  } catch (e) {
    console.error(e)
    return null
  }
}

export function getBalance(web3Instance, address) {
  return new Promise((resolve, reject) => {
    web3Instance.eth.getBalance(address, (err, balance) => {
      if (err) {
        reject(new Error('Unable to retrieve balance for address: ' + address))
      } else {
        resolve(balance)
      }
    })
  })
}
