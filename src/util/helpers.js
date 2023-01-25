import { timeOutApi } from '@/util/constants/scanConfigs'

let timer = null
let lastCall = 0
let delayCall = 0

export function clearTimerDebounce() {
    clearTimeout(timer)
}

export function debounce(callback, delay) {
    return (...args) => {
        console.log(args)
        let previousCall = lastCall
        lastCall = Date.now()

        if (delayCall && lastCall > delayCall + timeOutApi) {
            clearTimeout(timer)
            delay = 0
            previousCall = lastCall
            delayCall = 0
            timer = setTimeout(() => {
                callback(...args)
            }, delay)
            return
        }

        if (!previousCall) {
            delay = 0
        } else {
            delay += timeOutApi
        }

        if (+delay) {
            delayCall = lastCall + delay
        }

        timer = setTimeout(() => {
            callback(...args)
        }, delay)
    }
}
