const { MessageEmbed , GuildMember } = require('discord.js')

module.exports = [
    {
        name: "kick",
        category: "guild_admin",
        information: "เตะผู้ใช้",
        async run(client, message, args) {
            try {
                const member = message.mentions.members.first()
                if (!member) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "โปรดระบุผู้ใช้ที่ต้องการเตะด้วยนะคะ",
                        color: 0x00ffff
                    })
                ]})
                message.guild.members.kick(member, (args[1] ? args.slice(1, args.length - 1).join(" ") : "None"))
                message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ดำเนินการเรียบร้อยค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: `\`${member.user.username + member.user.discriminator}\`\nได้ถูกเตะออกจากดิสเรียบร้อยค่ะ`,
                        description: "เหตุผล : " + (args[1] ? args.slice(1, args.length - 1).join(" ") : "None"),
                        color: 0x00ffff
                    })
                ]})
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
    {
        name: "ban",
        category: "guild_admin",
        information: "แบนผู้ใช้",
        async run(client, message, args) {
            try {
                const member = message.mentions.members.first()
                if (!member) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "โปรดระบุผู้ใช้ที่ต้องการแบนด้วยนะคะ",
                        color: 0x00ffff
                    })
                ]})
                message.guild.members.ban(member, {days: 7, reason: (args[1] ? args.slice(1, args.length - 1).join(" ") : "None")})
                message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ดำเนินการเรียบร้อยค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: `\`${member.user.username + member.user.discriminator}\`\nได้ถูกแบนออกจากดิสเรียบร้อยค่ะ`,
                        description: "เหตุผล : " + (args[1] ? args.slice(1, args.length - 1).join(" ") : "None"),
                        color: 0x00ffff
                    })
                ]})
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
    {
        name: "unban",
        category: "guild_admin",
        information: "ปลดแบนผู้ใช้",
        async run(client, message, args) {
            try {
                const user = await client.users.fetch(args[0])
                if (!user) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "ไม่พบผู้ใช้นี้ในระบบค่ะ",
                        color: 0x00ffff
                    })
                ]})
                message.guild.members.unban(user, (args[1] ? args.slice(1, args.length - 1).join(" ") : "None"))
                message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ดำเนินการเรียบร้อยค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: `\`${user.username + user.discriminator}\`\nได้ปลดแบนจากดิสเรียบร้อยค่ะ`,
                        description: "เหตุผล : " + (args[1] ? args.slice(1, args.length - 1).join(" ") : "None"),
                        color: 0x00ffff
                    })
                ]})
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
    {
        name: "edit-server-icon",
        aliases: ["editsvi"],
        category: "guild_admin",
        information: "เปลี่ยนไอคอนเซิร์ฟเวอร์ของคุณ",
        async run(client, message, args) {
            try {
                if (!args[0]) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "โปรดระบุ URL ของรูปภาพที่ต้องการจะเปลี่ยนด้วยนะคะ",
                        color: 0x00ffff
                    })
                ]})
                message.guild.setIcon(args.join(" "))
                message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ดำเนินการเรียบร้อยค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: `เปลี่ยนไอคอนเซิร์ฟเวอร์ตาม url เรียบร้อยค่ะ`,
                        image: {
                            url: args.join(" ")
                        },
                        color: 0x00ffff
                    })
                ]})
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
    {
        name: "edit-server-name",
        category: "guild_admin",
        information: "เปลี่ยนไอคอนของเซิร์ฟเวอร์",
        async run(client, message, args) {
            try {
                if (!args[0]) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "โปรดระบุชื่อเซิร์ฟเวอร์ที่ต้องการจะตั้งด้วยนะคะ",
                        color: 0x00ffff
                    })
                ]})
                message.guild.setName(args.join(" "))
                message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ดำเนินการเรียบร้อยค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: `เปลี่ยนชื่อเซิร์ฟเวอร์เป็น "${args.join(" ")}" เรียบร้อยค่ะ`,
                        color: 0x00ffff
                    })
                ]})
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
    {
        name: "change-nickname",
        aliases: ["chnick"],
        category: "guild_admin",
        information: "เปลี่ยนชื่อเล่นผู้ใช้",
        async run(client, message, args) {
            try {
                const member = message.mentions.members.first()
                if (!member) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "โปรดระบุผู้ใช้ที่ต้องการตั้งชื่อเล่นด้วยนะคะ",
                        color: 0x00ffff
                    })
                ]})
                if (!args[1]) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "โปรดระบุชื่อเล่นที่ต้องการจะตั้งค่าด้วยนะคะ",
                        description: `เช่น \`${await client.function.main.get_prefix(client, message)}chnick @nicenathapong คนหล่อเท่\``,
                        color: 0x00ffff
                    })
                ]})
                member.setNickname(args.slice(1, args.length).join(" "))
                message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ดำเนินการเรียบร้อยค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: `เปลี่ยนชื่อเล่น \`${member.user.username}\` เป็น \`${args.slice(1, args.length).join(" ")}\` เรียบร้อยค่ะ`,
                        color: 0x00ffff
                    })
                ]})
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    }
]