const request = require('request')

module.exports = [
    {
        name: "getimgurls",
        run(client, word, count) {
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
        run(client, word, type) {
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
        name: "stats",
        run(client) {
            return new Promise((resolve, reject) => {
                request.get({
                    url: client.config.api_url + "stats",
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
    },
    {
        name: "rule34",
        run(tags) {
            return new Promise((resolve, reject) => {
                request.get({
                    url: encodeURI(`https://rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&limit=1000&tags=${tags}`),
                    time: true
                }, (err, res) => {
                    if (err) resolve("NO_PIC_FROM_RULE34")
                    resolve(JSON.parse(res.body).map(p => p.file_url))
                })
            })
        }
    },
    {
        name: "getnhtrandom",
        run() {
            const url = `https://nhentai.net/g/${Math.floor(Math.random() * 300000)}/`
            return new Promise((resolve, reject) => {
                request.get({
                    url: url,
                    time: true
                }, (err, res) => {
                    if (err) reject("[err] API error.", err)
                    resolve({
                        data: res.body,
                        url: url,
                        ms: res.elapsedTime
                    })
                })
            })
        }
    }
]