const { MessageEmbed } = require('discord.js')
const { readdirSync } = require('fs')
const { inspect } = require('util')

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
                const user = message.mentions.members.first()

                if (!user) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "โปรดระบุผู้ใช้ที่ต้องการจะตั้งให้เป็นแอดมินด้วยนะคะ",
                        color: 0x00ffff
                    })
                ]})

                const admin_list = await client.function.database.admin_list(client)

                if (admin_list.includes(user.id)) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "ผู้ใช้นี้จะเป็นแอดมินของบอทอยู่แล้วนะคะ",
                        color: 0x00ffff
                    })
                ]})

                client.mysql.query(`INSERT INTO \`admin_list\` (id, user_id, adder) VALUES (NULL, '${user.id}', '${message.author.id}')`, (err, ins) => { if (err) throw err })

                message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ดำเนินการเรียบร้อยค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: `เพิ่ม \`${user.user.username}#${user.user.discriminator}\``,
                        description: "ให้เป็นแอดมินของบอทเรียบร้อยค่ะ",
                        color: 0x00ffff
                    })
                ]})

                user.send({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ยินดีด้วย!",
                            url: client.config.embed_author_url
                        },
                        title: `คุณถูกเพิ่มให้เป็นแอดมินของบอท ${client.user.username} ค่ะ`,
                        description: `เพิ่มโดย ${message.author.tag}`,
                        color: 0x00ffff
                    })
                ]})
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
    {
        name: "admin-remove",
        aliases: ["adminremove","removeadmin"],
        category: "bot_admin",
        information: "ลบแอดมินบอท",
        async run(client, message) {
            try {
                const user = message.mentions.members.first()

                if (!user) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "โปรดระบุผู้ใช้ที่ต้องการจะปลดแอดมินด้วยนะคะ",
                        color: 0x00ffff
                    })
                ]})

                const admin_list = await client.function.database.admin_list(client)

                if (!admin_list.includes(user.id)) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "ผู้ใช้นี้ไม่ได้เป็นแอดมินของบอทอยู่แล้วค่ะ",
                        color: 0x00ffff
                    })
                ]})

                client.mysql.query(`DELETE FROM \`admin_list\` WHERE \`user_id\` LIKE '${user.id}'`, (err, ins) => { if (err) throw err })

                message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ดำเนินการเรียบร้อยค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: `ปลด \`${user.user.username}#${user.user.discriminator}\``,
                        description: "จากการเป็นแอดมินบอทเรียบร้อยค่ะ",
                        color: 0x00ffff
                    })
                ]})
                user.send({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่นะ!",
                            url: client.config.embed_author_url
                        },
                        title: `คุณถูกปลดจากการเป็นแอดมินของบอท ${client.user.username} ค่ะ`,
                        description: `ปลดโดย ${message.author.tag}`,
                        color: 0x00ffff
                    })
                ]})
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
    {
        name: "menuremove",
        category: "bot_admin",
        information: "ลบเมนูออกจากคลังเมนู",
        async run(client, message, args) {
            try {
                if (!args[0]) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "โปรดระบุลำดับของเมนูที่ต้องการจะลบออกจากคลังด้วยนะคะ",
                        description: `เช่น \`${await client.function.main.get_prefix(client, message)}menuremove 14\``,
                        color: 0x00ffff
                    })
                ]})
                const menus = await client.function.database.core_menulist(client)
                let menu
                
                if (client.function.main.isNum(args.join(" "))) {
                    if (menus.length < parseInt(args.join(" ")) || menus.length > parseInt(args.join(" "))) return message.loading.edit({embeds:[
                        new MessageEmbed({
                            author: {
                                icon_url: client.user.avatarURL(),
                                name: "ไม่สามารถดำเนินการได้ค่ะ!",
                                url: client.config.embed_author_url
                            },
                            title: "ไม่มีเมนูนั้นในคลังเมนูค่ะ",
                            description: `ตอนนี้ในคลังเมนูมีเมนูแค่ ${menus.length} ค่ะ`,
                            color: 0x00ffff
                        })
                    ]})
                    menu = menus[parseInt(args.join(" "))]
                } else {
                    menu = menus.find(m => m.menu === args.join(" "))
                    if (!menu) return message.loading.edit({embeds:[
                        new MessageEmbed({
                            author: {
                                icon_url: client.user.avatarURL(),
                                name: "ไม่สามารถดำเนินการได้ค่ะ!",
                                url: client.config.embed_author_url
                            },
                            title: "ไม่มีเมนูนั้นในคลังเมนูค่ะ",
                            color: 0x00ffff
                        })
                    ]})
                }
                client.datacore.query(`DELETE FROM \`food\` WHERE \`menu\` LIKE '${menu.menu}'`, (err, ins) => { if (err) throw err })
                message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ดำเนินการเรียบร้อยค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: `ลบ "${menu.menu}" ออกจากคลังเมนูเรียบร้อยค่ะ`,
                        color: 0x00ffff
                    })
                ]})
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
    {
        name: "eval",
        category: "bot_admin",
        information: "รันคำสั่งบน Process ของบอท",
        async run(client, message, args) {
            try {
                const e = inspect(await eval(args.join(" ")))

                message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ดำเนินการเรียบร้อยค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "นี่คือผลลัพธ์ที่ได้ค่ะ",
                        description: "```js\n" + (e.length > 4096 ? e.slice(0, 4098) : e) + "```",
                        color: 0x00ffff
                    })
                ]})
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    }
]