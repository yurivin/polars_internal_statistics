import { checkAndInstantiateWeb3 } from '@/util/web3'


class ContractInstance {
  constructor(abi, address) {
    this.address = address
    this.web3Instance = checkAndInstantiateWeb3()
    this.contractInstance = this.web3Instance
      ? new this.web3Instance.eth.Contract(abi, address)
      : null
    if (!this.contractInstance) {
      return
    }

    for (const method in this.contractInstance.methods) {
      if (abi.findIndex((item) => item.name === method) === -1) {
        continue
      }

      this[method] = async function () {
        const methodDescription = abi.find((item) => item.name === method)

        const inputs = [...arguments]
        let excessInputs = []
        if (methodDescription.inputs.length !== arguments.length) {
          excessInputs = inputs.slice(methodDescription.inputs.length)
          inputs.splice(methodDescription.inputs.length, excessInputs.length)
          if (!excessInputs.every((item) => typeof item === 'object')) {
            throw new Error('Excess arguments are not Object type')
          }
        }

        const func = this.contractInstance.methods[method](...inputs)

        if (
          func._method.stateMutability === 'view' ||
          func._method.stateMutability === 'pure'
        ) {
          // each view-method of the contract returns {method: String, data: Any } object
          return func.call().then((data) => Object.assign({}, { method, data }))
        } else {

          // TODO: rewrite Promise executor function
          // eslint-disable-next-line no-async-promise-executor
          return new Promise(async (resolve, reject) => {
            func
              .on('transactionHash', function (hash) {
                generateCustomEvent(`transactionHash`, hash)
              })
              .on('receipt', (receipt) => {
                resolve(receipt)
              })
              .on('error', function (error) {
                reject(error)
              })
          })
        }
      }
    }
  }
}

export default ContractInstance

function generateCustomEvent(name, data) {
  const event = new CustomEvent(name, { detail: data })
  window.dispatchEvent(event)
}
