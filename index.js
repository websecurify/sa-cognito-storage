var setup = function () {
    var iframe = document.querySelector('iframe[src="https://fs.secapps.com"]')

    if (!iframe) {
        iframe = document.createElement('iframe')

        iframe.src = 'https://fs.secapps.com'
        iframe.style = 'display: none'

        document.body.appendChild(iframe)
    }

    return new Promise(function (resolve, reject) {
        if (iframe.contentDocument.readyState === 'complete' && iframe.contentDocument.domain === 'secapps.com') {
            var documentDomain = document.domain

            document.domain = 'secapps.com'

            resolve({storage: iframe.contentWindow.localStorage, source: iframe.contentWindow})

            document.document = documentDomain
        } else {
            function onLoadHandler() {
                iframe.removeEventListener('load', onLoadHandler)
                iframe.removeEventListener('error', onErrorHandler)

                var documentDomain = document.domain

                document.domain = 'secapps.com'

                resolve({storage: iframe.contentWindow.localStorage, source: iframe.contentWindow})

                document.document = documentDomain
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
