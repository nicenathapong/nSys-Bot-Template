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
    }
]