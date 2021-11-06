const { MessageEmbed } = require('discord.js')

module.exports = [
    {
        name: "error_log",
        run(err, client, message) {
            console.log(err)
            message.loading.edit({embeds:[
                new MessageEmbed({
                    author: {
                        name: "เกิดข้อผิดพลาดค่ะ",
                        icon_url: client.user.avatarURL({ dynamic:true }),
                        url: client.config.embed_author_url
                    },
                    color: 0x00ffff
                })
            ]})
        }
    },
    {
        name: "random_choice",
        run(list) {
            return list[Math.floor((Math.random()*list.length))]
        }
    },
    {
        name: "get_prefix",
        run(client, message) {
            return client.config.prefix
        }
    },
    {
        name: "reload",
        async run() {

        }
    },
    {
        name: "isAdmin",
        run(client, id) {
            return client.config.admin_id.includes(id)
        }
    }
]