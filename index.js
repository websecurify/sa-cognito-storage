document.domain = 'secapps.com'

var setup = function () {
    var iframe = document.querySelector('iframe[src="https://fs.secapps.com"]')

    if (!iframe) {
        console.log('[cognito-storage] Initiating frame.')

        iframe = document.createElement('iframe')

        iframe.src = 'https://fs.secapps.com'
        iframe.style = 'display: none'

        document.body.appendChild(iframe)
    }

    return new Promise(function (resolve, reject) {
        var acquired

        try {
            acquired = iframe.contentDocument.readyState === 'complete' && iframe.contentDocument.domain === 'secapps.com'
        } catch(e) {
            acquired = false
        }

        if (own) {
            console.log('[cognito-storage] Frame acquired.')

            resolve({storage: iframe.contentWindow.localStorage, source: iframe.contentWindow})
        } else {
            function onLoadHandler() {
                iframe.removeEventListener('load', onLoadHandler)
                iframe.removeEventListener('error', onErrorHandler)

                console.log('[cognito-storage] Frame acquired.')

                resolve({storage: iframe.contentWindow.localStorage, source: iframe.contentWindow})
            }

            function onErrorHandler(error) {
                iframe.removeEventListener('load', onLoadHandler)
                iframe.removeEventListener('error', onErrorHandler)

                reject(error)
            }

            iframe.addEventListener('load', onLoadHandler)
            iframe.addEventListener('error', onErrorHandler)
        }
    })
}

module.exports = function (callback) {
    var promise = setup()

    if (callback) {
        promise
            .then(function (result) {
                callback(null, result.storage, result.source)
            })
            .catch(function (error) {
                callback(error)
            })
    } else {
        return promise
    }
}
