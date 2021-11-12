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
        name: "db_ping",
        run(client, db) {
            return new Promise((resolve, reject) => {
                const startTime = new Date()
                client[db === 0 ? "mysql" : "datacore"].query(`SELECT table_name AS "table", ROUND(((data_length + index_length) / 1024 / 1024), 2) AS "size" FROM information_schema.TABLES WHERE table_schema = "${db === 0 ? client.user.username : "nDataCore"}" ORDER BY (data_length + index_length) DESC`, (err, res) => {
                    if (res.length > 0) {
                        var endTime = new Date()
                        resolve({ size: res.map(r => r.size).reduce((a, b) => a + b), ping: endTime.getTime() - startTime.getTime() })
                    } if (err) {
                        reject("[err] database error.", err)
                    }
                })
            })
        }
    },
    {
        name: "core_menulist",
        run(client) {
            return new Promise((resolve, reject) => {
                client.datacore.query("SELECT * FROM `food`", (err, res) => {
                    if (err) reject("[err] database error.", err)
                    if (res.length > 0) {
                        resolve(res)
                    }
                    else resolve([])
                })
            })
        }
    }
]