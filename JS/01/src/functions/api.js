const request = require('request')

module.exports = [
    {
        name: "getimgurls",
        run(word, count) {
            return new Promise((resolve, reject) => {
                request.get({
                    url: encodeURI(`${client.config.api_url}getimgurl/${word}/${count ? count : 1}`),
                    time: true
                }, (err, res) => {
                    if (err) reject("[err] API error.", err)
                    resolve({
                        data: JSON.parse(res.body),
                        ms: res.elapsedTime
                    })
                })
            })
        }
    },
    {
        name: "loo_translate",
        run(word, type) {
            return new Promise((resolve, reject) => {
                request.get({
                    url: encodeURI(`${client.config.api_url + type}/${word}`),
                    time: true
                }, (err, res) => {
                    if (err) reject("[err] API error.", err)
                    resolve({
                        data: JSON.parse(res.body).data,
                        ms: res.elapsedTime
                    })
                })
            })
        }
    },
    {
        name: "covid",
        run() {
            return new Promise((resolve, reject) => {
                request.get({
                    url: "https://covid19.ddc.moph.go.th/api/Cases/today-cases-all",
                    time: true
                }, (err, res) => {
                    if (err) reject("[err] API (ร้าบาน) error.", err)
                    resolve({
                        data: JSON.parse(res.body),
                        ms: res.elapsedTime
                    })
                })
            })
        }
    }
]