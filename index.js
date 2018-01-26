var setup = function () {
    var iframe = document.querySelector('iframe[src="https://fs.secapps.com"]')

    if (!iframe) {
        iframe = document.createElement('iframe')

        iframe.src = 'https://fs.secapps.com'
        iframe.style = 'display: none'

        document.body.appendChild(iframe)
    }

    return new Promise(function (resolve, reject) {
        if (iframe.contentDocument.readyState === 'complete') {
            var documentDomain = document.domain

            document.domain = 'secapps.com'

            resolve({storage: iframe.contentWindow.localStorage, source: iframe.contentWindow})

            document.document = documentDomain
        } else {
            iframe.onload = function () {
                var documentDomain = document.domain

                document.domain = 'secapps.com'

                resolve({storage: iframe.contentWindow.localStorage, source: iframe.contentWindow})

                document.document = documentDomain
            }

            iframe.onerror = function (error) {
                reject(error)
            }
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
