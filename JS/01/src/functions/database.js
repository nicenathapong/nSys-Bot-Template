module.exports = [
    {
        name: "get_this_guild_settings",
        run(client, guild_id) {
            return new Promise((resolve, reject) => {
                client.mysql.query(`SELECT * FROM \`guilds\` WHERE \`guild_id\` = '${guild_id}'`, (err, res) => {
                    if (err) reject(err)
                    if (res.length > 0) resolve(res[0])
                    else resolve(null)
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
    },
    {
        name: "core_r34",
        run(client) {
            return new Promise((resolve, reject) => {
                client.datacore.query("SELECT * FROM `rule34`", (err, res) => {
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