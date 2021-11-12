const { MessageEmbed } = require('discord.js')
const { readdirSync } = require('fs')

module.exports = [
    {
        name: "reload",
        category: "bot_admin",
        information: "รีโหลดบอท",
        async run(client, message) {
            try {
                client.cluster.broadcastEval(client => client.function.main.reload(client))
                message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ดำเนินการเรียบร้อยค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "รีโหลด Commands Events และ Functions เรียบร้อยค่ะ",
                        color: 0x00ffff
                    })
                ]})
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
    {
        name: "admin-add",
        aliases: ["adminadd","addadmin"],
        category: "bot_admin",
        information: "เพิ่มแอดมินบอท",
        async run(client, message) {
            try {
                
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
    {
        name: "admin-remove",
        aliases: ["adminremove","removeadd"],
        category: "bot_admin",
        information: "ลบแอดมินบอท",
        async run(client, message) {
            try {
                
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
    {
        name: "menuremove",
        category: "bot_admin",
        information: "ลบเมนูออกจากคลังเมนู",
        async run(client, message) {
            try {
                
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    }
]