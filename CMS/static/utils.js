const isResSuccess = response => {
    if (!response || !response.status) {
        return false
    }
    if (response.status !== 200) {
        return false
    }
    if (response.data && response.data.code) {
        if (response.data.code !== 200) {
            return false
        }
    }
    return true
}

const errLog = err => {
    if (!err) {
        return
    }
    console.log(`[${err.status}] ${err.statusText}`)
    if (err.data) {
        console.log(err.data)
    }
}

export default {
    isResSuccess, errLog
}
  