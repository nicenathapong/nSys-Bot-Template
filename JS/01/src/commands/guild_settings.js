const { MessageEmbed } = require('discord.js')

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
                        "INSERT INTO `guilds` (id, guild_id, custom_prefix, blacklist, premium, ranking_exp, welcome_channel_id, auto_voice_channel, music_player, reactions_roles) " +
                        `VALUES (NULL, ${message.guildId}, '${args[0]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL)`, (err, ins) => { if (err) console.log(err) })
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
                        "INSERT INTO `guilds` (id, guild_id, custom_prefix, blacklist, premium, ranking_exp, welcome_channel_id, auto_voice_channel, music_player, reactions_roles) " +
                        `VALUES (NULL, ${message.guildId}, NULL, NULL, NULL, NULL, '${channel.id}', NULL, NULL, NULL)`, (err, ins) => { if (err) console.log(err) })
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
                    const category = await message.guild.channels.create("create room | nSys", {
                        type: "GUILD_CATEGORY"
                    })
                    const channel = await message.guild.channels.create("join - create your room", {
                        type: 'GUILD_VOICE',
                        parent: category
                    })
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
                        "INSERT INTO `guilds` (id, guild_id, custom_prefix, blacklist, premium, ranking_exp, welcome_channel_id, auto_voice_channel, music_player, reactions_roles) " +
                        `VALUES (NULL, ${message.guildId}, NULL, NULL, NULL, NULL, NULL, '${JSON.stringify({ category_id: auto.category.id, channel_id: auto.channel.id })}', NULL, NULL)`, (err, ins) => { if (err) console.log(err) })
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
        name: "addreacrole",
        category: "guild_settings",
        information: "เพิ่ม reactions roles ให้กับข้อความ",
        async run(client, message) {
            try {
                
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
    {
        name: "rmreacrole",
        category: "guild_settings",
        information: "ลบ reactions roles ของข้อความ",
        async run(client, message) {
            try {
                
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
    {
        name: "reacrolelist",
        category: "guild_settings",
        information: "ดู reactions roles ทั้งหมดของข้อความ",
        async run(client, message) {
            try {
                
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
    {
        name: "rmallreacrole",
        category: "guild_settings",
        information: "ลบ reactions roles ของข้อความทั้งหมด",
        async run(client, message) {
            try {
                
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
    {
        name: "rankingsystem",
        category: "guild_settings",
        information: "เปิด Ranking System ของดิส",
        async run(client, message) {
            try {
                
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
]