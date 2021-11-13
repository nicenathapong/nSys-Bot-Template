const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')

module.exports = [
    {
        name: "setprefix",
        aliases: ["customprefix"],
        category: "guild_settings",
        information: "ตั้งค่า custom prefix ของดิส",
        async run(client, message, args) {
            try {
                if (!args[0]) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "โปรดใส่ Prefix ที่ต้องการจะตั้งค่าด้วยนะคะ",
                        description: `เช่น \`${client.function.main.get_prefix(client, message)}setprefix =\``,
                        color: 0x00ffff
                    })
                ]})
                const this_guild_settings = await client.function.database.get_this_guild_settings(client, message.guildId)
                if (this_guild_settings !== null) {
                    client.mysql.query(`UPDATE \`guilds\` SET \`custom_prefix\` = '${args[0]}' WHERE \`guild_id\` = '${message.guildId}'`, (err, res) => { if (err) console.log(err) })
                } else {
                    client.mysql.query(
                        "INSERT INTO `guilds` (id, guild_id, custom_prefix, blacklist, premium, ranking_exp, welcome_channel_id, auto_voice_channel, music_player) " +
                        `VALUES (NULL, '${message.guildId}', '${args[0]}', NULL, NULL, NULL, NULL, NULL, NULL)`, (err, ins) => { if (err) console.log(err) })
                }
                message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ดำเนินการเรียบร้อยค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: `ตั้งค่า Prefix เป็น \`${args[0]}\` เรียบร้อยค่ะ`,
                        color: 0x00ffff
                    })
                ]})
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
    {
        name: "rmsetprefix",
        aliases: ["rmcustomprefix"],
        category: "guild_settings",
        information: "ลบการตั้งค่า custom prefix ของดิส",
        async run(client, message) {
            try {
                const this_guild_settings = await client.function.database.get_this_guild_settings(client, message.guildId)
                if (this_guild_settings?.custom_prefix !== null) {
                    client.mysql.query(`UPDATE \`guilds\` SET \`custom_prefix\` = NULL WHERE \`guild_id\` = '${message.guildId}'`, (err, res) => { if (err) console.log(err) })
                    return message.loading.edit({embeds:[
                        new MessageEmbed({
                            author: {
                                icon_url: client.user.avatarURL(),
                                name: "ดำเนินการเรียบร้อยค่ะ!",
                                url: client.config.embed_author_url
                            },
                            title: "ลบการตั้งค่า Custom Prefix เรียบร้อยค่ะ",
                            description: `ตอนนี้ Prefix ของดิสนี้กลับมาเป็น \`${client.function.main.get_prefix(client, message)}\` แล้วค่ะ`,
                            color: 0x00ffff
                        })
                    ]})
                }
                message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "ไม่พบการตั้งค่า Custom prefix ของดิสนี้ในในระบบค่ะ",
                        color: 0x00ffff
                    })
                ]})
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
    {
        name: "setjoinlog",
        aliases: ["welcome-message-add"],
        category: "guild_settings",
        information: "ตั้งค่าห้อง welcome message ของดิส",
        async run(client, message, args) {
            try {
                if (!args[0]) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "โปรดใส่ช่องข้อความที่ต้องการจะตั้งค่าด้วยนะคะ",
                        description: `เช่น | ${client.function.main.get_prefix(client, message)}setjoinlog <#${message.channel.id}>`,
                        color: 0x00ffff
                    })
                ]})
                const channel = message.guild.channels.cache.get(args[0].replace("<","").replace("#","").replace(">",""))
                if (!channel.id) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "ไม่พบช่องข้อความนั้นในดิสนี้ค่ะ",
                        color: 0x00ffff
                    })
                ]})
                const this_guild_settings = await client.function.database.get_this_guild_settings(client, message.guildId)
                if (this_guild_settings !== null) {
                    client.mysql.query(`UPDATE \`guilds\` SET \`welcome_channel_id\` = '${channel.id}' WHERE \`guild_id\` = '${message.guildId}'`, (err, res) => { if (err) console.log(err) })
                } else {
                    client.mysql.query(
                        "INSERT INTO `guilds` (id, guild_id, custom_prefix, blacklist, premium, ranking_exp, welcome_channel_id, auto_voice_channel, music_player) " +
                        `VALUES (NULL, '${message.guildId}', NULL, NULL, NULL, NULL, '${channel.id}', NULL, NULL)`, (err, ins) => { if (err) console.log(err) })
                }
                message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ดำเนินการเรียบร้อยค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "ตั้งค่า Welcome message",
                        description: `เป็นช่อง <#${channel.id}> เรียบร้อยค่ะ`,
                        color: 0x00ffff
                    })
                ]})
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
    {
        name: "rmsetjoinlog",
        aliases: ["rmjoinlog","welcome-message-remove"],
        category: "guild_settings",
        information: "ลบการตั้งค่าห้อง welcome message ของดิส",
        async run(client, message) {
            try {
                const this_guild_settings = await client.function.database.get_this_guild_settings(client, message.guildId)
                if (this_guild_settings?.welcome_channel_id !== null) {
                    client.mysql.query(`UPDATE \`guilds\` SET \`welcome_channel_id\` = NULL WHERE \`guild_id\` = '${message.guildId}'`, (err, res) => { if (err) console.log(err) })
                    return message.loading.edit({embeds:[
                        new MessageEmbed({
                            author: {
                                icon_url: client.user.avatarURL(),
                                name: "ดำเนินการเรียบร้อยค่ะ!",
                                url: client.config.embed_author_url
                            },
                            title: "ลบการตั้งค่า Welcome message เรียบร้อยค่ะ",
                            color: 0x00ffff
                        })
                    ]})
                }
                message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "ไม่พบการตั้งค่า Welcome message ของดิสนี้ในในระบบค่ะ",
                        color: 0x00ffff
                    })
                ]})
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
    {
        name: "addautovc",
        category: "guild_settings",
        information: "เพิ่มโซนสร้างห้องอัตโนมัติของดิส",
        async run(client, message) {
            try {
                async function create_category_and_channel() {
                    const category = await message.guild.channels.create(`create room | ${client.user.username}`, { type: "GUILD_CATEGORY" })
                    const channel = await message.guild.channels.create("join - create your room", { type: 'GUILD_VOICE', parent: category })
                    return {category: category, channel: channel}
                }
                const this_guild_settings = await client.function.database.get_this_guild_settings(client, message.guildId)
                if (this_guild_settings?.auto_voice_channel) {
                    return message.loading.edit({embeds:[
                        new MessageEmbed({
                            author: {
                                icon_url: client.user.avatarURL(),
                                name: "ไม่สามารถดำเนินการได้ค่ะ!",
                                url: client.config.embed_author_url
                            },
                            title: "มีการตั้งค่าโซนสร้างห้องอัตโนมัติอยู่ในระบบแล้วค่ะ ",
                            description: `หากต้องการตั้งค่าใหม่ โปรดลบการตั้งค่าเก่าออกก่อนนะคะ\nโดยใช้คำสั่ง \`${client.function.main.get_prefix(client, message)}rmautovc\``,
                            color: 0x00ffff
                        })
                    ]})
                }
                let auto
                if (this_guild_settings !== null) {
                    auto = await create_category_and_channel()
                    client.mysql.query(`UPDATE \`guilds\` SET \`auto_voice_channel\` = '${JSON.stringify({ category_id: auto.category.id, channel_id: auto.channel.id })}' WHERE \`guild_id\` = '${message.guildId}'`, (err, res) => { if (err) console.log(err) })
                } else {
                    auto = await create_category_and_channel()
                    client.mysql.query(
                        "INSERT INTO `guilds` (id, guild_id, custom_prefix, blacklist, premium, ranking_exp, welcome_channel_id, auto_voice_channel, music_player) " +
                        `VALUES (NULL, '${message.guildId}', NULL, NULL, NULL, NULL, NULL, '${JSON.stringify({ category_id: auto.category.id, channel_id: auto.channel.id })}', NULL)`, (err, ins) => { if (err) console.log(err) })
                }
                message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ดำเนินการเรียบร้อยค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "เพิ่มโซนสร้างห้องอัตโนมัติเรียบร้อยค่ะ",
                        description: `<#${auto.channel.id}>`,
                        color: 0x00ffff
                    })
                ]})
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
    {
        name: "rmautovc",
        category: "guild_settings",
        information: "ลบโซนสร้างห้องอัตโนมัติของดิส",
        async run(client, message) {
            try {
                const this_guild_settings = await client.function.database.get_this_guild_settings(client, message.guildId)
                if (this_guild_settings?.auto_voice_channel !== null) {
                    client.mysql.query(`UPDATE \`guilds\` SET \`auto_voice_channel\` = NULL WHERE \`guild_id\` = '${message.guildId}'`, (err, res) => { if (err) console.log(err) })
                    return message.loading.edit({embeds:[
                        new MessageEmbed({
                            author: {
                                icon_url: client.user.avatarURL(),
                                name: "ดำเนินการเรียบร้อยค่ะ!",
                                url: client.config.embed_author_url
                            },
                            title: "ลบโซนสร้างห้องอัตโนมัติเรียบร้อยค่ะ",
                            color: 0x00ffff
                        })
                    ]})
                }
                message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "ไม่พบการตั้งค่าโซนสร้างห้องอัตโนมัติของดิสนี้ในในระบบค่ะ",
                        color: 0x00ffff
                    })
                ]})
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
    {
        name: "rankingsystem",
        aliases: ["rankingmode"],
        category: "guild_settings",
        information: "เปิด / ปิด Ranking System ของดิส",
        async run(client, message) {
            try {
                const this_guild_settings = await client.function.database.get_this_guild_settings(client, message.guildId)
                if (this_guild_settings !== null) {
                    if (this_guild_settings.ranking_exp === null) {
                        client.mysql.query(`UPDATE \`guilds\` SET \`ranking_exp\` = '${JSON.stringify([])}' WHERE \`guild_id\` = '${message.guildId}'`, (err, res) => { if (err) console.log(err) })
                    } else {
                        message.loading.edit({embeds:[
                            new MessageEmbed({
                                author: {
                                    icon_url: client.user.avatarURL(),
                                    name: "คุณต้องการจะปิด Ranking System หรือไม่?",
                                    url: client.config.embed_author_url
                                },
                                title: "หากคุณปิด ข้อมูลทั้งหมดจะถูกล้างทันทีนะคะ",
                                color: 0x00ffff
                            })
                        ], components: [
                            new MessageActionRow({
                                components: [
                                    new MessageButton({
                                        style: "SUCCESS",
                                        emoji: "👍",
                                        label: "ใช่ ปิดได้เลย",
                                        customId: "yes"
                                    }),
                                    new MessageButton({
                                        style: "DANGER",
                                        emoji: "👎",
                                        label: "ไม่ ฉันไม่ต้องการปิด",
                                        customId: "no"
                                    })
                                ]
                            })
                        ]})
                        return message.loading.createMessageComponentCollector({ filter: ({ user }) => user.id === message.author.id, time: 30 * 60000 }).on("collect", interaction => {
                            if (interaction.customId === "yes") {
                                client.mysql.query(`UPDATE \`guilds\` SET \`ranking_exp\` = NULL WHERE \`guild_id\` = '${message.guildId}'`, (err, res) => { if (err) console.log(err) })
                                return message.loading.edit({embeds:[
                                    new MessageEmbed({
                                        author: {
                                            icon_url: client.user.avatarURL(),
                                            name: "ดำเนินการเรียบร้อยค่ะ!",
                                            url: client.config.embed_author_url
                                        },
                                        title: "ปิดการใช้งาน Ranking System เรียบร้อยค่ะ",
                                        color: 0x00ffff
                                    })
                                ], components: []})
                            }
                            message.loading.edit({embeds:[
                                new MessageEmbed({
                                    author: {
                                        icon_url: client.user.avatarURL(),
                                        name: "ยกเลิกการทำงานเรียบร้อยค่ะ",
                                        url: client.config.embed_author_url
                                    },
                                    color: 0x00ffff
                                })
                            ], components: []})
                        })
                    }
                } else {
                    client.mysql.query(
                        "INSERT INTO `guilds` (id, guild_id, custom_prefix, blacklist, premium, ranking_exp, welcome_channel_id, auto_voice_channel, music_player) " +
                        `VALUES (NULL, '${message.guildId}', NULL, NULL, NULL, '${JSON.stringify([])}', NULL, NULL, NULL)`, (err, ins) => { if (err) console.log(err) })
                }
                message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ดำเนินการเรียบร้อยค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "เปิดการใช้งาน Ranking Mode เรียบร้อยค่ะ",
                        color: 0x00ffff
                    })
                ]})
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
]