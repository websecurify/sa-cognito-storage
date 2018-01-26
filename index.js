var setup = function () {
    var iframe = document.createElement('iframe')

    iframe.src = 'https://fs.secapps.com'
    iframe.style = 'display: none'

    document.body.appendChild(iframe)

    return new Promise(function (resolve, reject) {
        iframe.onload = function () {
            var documentDomain = document.domain

            document.domain = 'secapps.com'

            resolve(iframe.contentWindow.localStorage)

            document.document = documentDomain
        }

        iframe.onerror = function (error) {
            reject(error)
        }
    })
}

module.exports = function (callback) {
    var iframe = document.createElement('iframe')

    iframe.src = config.remote
    iframe.style = 'display: none'

    document.body.appendChild(iframe)

    var promise = setup()

    if (callback) {
        promise
        .then(function (storage) {
            callback(null, storage)
        })
        .catch(function (error) {
            callback(error)
        })
    } else {
        return promise
    }
}
