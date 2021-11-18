const { MessageEmbed , Permissions } = require('discord.js')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const color = require('colors')

module.exports = [
    {
        name: "ready",
        async run(client) {
            await client.manager.init(client.user.id)
            require("./handles/websocket")(client)
            console.log(
                "\n---------------------------------------------".yellow + "\n" +
                `nSystem bot is starting up! | Cluster ${client.cluster.id}`.yellow + "\n" +
                `Login as ${client.user.tag} | ${client.user.id}`.yellow + "\n" +
                "---------------------------------------------".yellow
            )
            
            const rest = new REST({ version: '9' }).setToken(client.token)
            try {
                console.log(`[cluster ${client.cluster.id}] Started refreshing application (/) commands.`)
                if (client.config.loadSlashGlobal) {
                    await rest.put(Routes.applicationCommands(client.user.id), { body: client.slashcommands_arr })
                } else {
                    client.config.guildTest.forEach(async id => {
                        await rest.put(Routes.applicationGuildCommands(client.user.id, id), { body: client.slashcommands_arr })
                    })
                }
                console.log(`[cluster ${client.cluster.id}] Successfully reloaded application (/) commands.`)
            } catch (e) { console.log(e) }

            client.guilds.cache.forEach(async guild => {
                guild.members.cache.get(client.user.id).setNickname(client.user.username)

                const this_guild_settings = await client.function.database.get_this_guild_settings(client, guild.id)
                
                if (this_guild_settings?.music_player) {
                    let channel, msg
                    try {
                        channel = guild.channels.cache.get(JSON.parse(this_guild_settings.music_player).channel_id)
                        msg = await channel.messages.fetch(JSON.parse(this_guild_settings.music_player).message_id)
                        msg.edit(client.utils.player_msg_default(client))
                        channel.bulkDelete((await channel.messages.fetch()).filter(m => m.id !== msg.id))
                    } catch (e) {
                        console.log(e)
                        if (e instanceof TypeError) { // ไม่เจอ channel
                            channel = await guild.channels.create(`🎶 ${client.user.username}`, { type: "GUILD_TEXT" })
                            msg = await channel.send(client.utils.player_msg_default(client))
                            return client.mysql.query(`UPDATE \`guilds\` SET \`music_player\` = '${JSON.stringify({ channel_id: channel.id, message_id: msg.id })}' WHERE \`guild_id\` = '${guild.id}'`, (err, res) => { if (err) console.log(err) })
                        }
                        msg = await channel.send(client.utils.player_msg_default(client))
                        client.mysql.query(`UPDATE \`guilds\` SET \`music_player\` = '${JSON.stringify({ channel_id: channel.id, message_id: msg.id })}' WHERE \`guild_id\` = '${guild.id}'`, (err, res) => { if (err) console.log(err) })
                    }
                }
                if (this_guild_settings?.auto_voice_channel) {
                    let channel = guild.channels.cache.get(JSON.parse(this_guild_settings.auto_voice_channel).channel_id)
                    let category = guild.channels.cache.get(JSON.parse(this_guild_settings.auto_voice_channel).category_id)
                    if (!category && !channel) {
                        category = await guild.channels.create(`create room | ${client.user.username}`, { type: "GUILD_CATEGORY" })
                        channel = await guild.channels.create("join - create your room", { type: 'GUILD_VOICE', parent: category })
                        client.mysql.query(`UPDATE \`guilds\` SET \`auto_voice_channel\` = '${JSON.stringify({ category_id: category.id, channel_id: channel.id })}' WHERE \`guild_id\` = '${channel.guild.id}'`, (err, res) => { if (err) console.log(err) })
                    }
                    if (!channel && category) {
                        channel = await guild.channels.create("join - create your room", { type: 'GUILD_VOICE', parent: category })
                        client.mysql.query(`UPDATE \`guilds\` SET \`auto_voice_channel\` = '${JSON.stringify({ category_id: category.id, channel_id: channel.id })}' WHERE \`guild_id\` = '${channel.guild.id}'`, (err, res) => { if (err) console.log(err) })
                    }
                    if (channel && !category) {
                        category = await guild.channels.create(`create room | ${client.user.username}`, { type: "GUILD_CATEGORY" })
                        channel.setParent(category)
                        client.mysql.query(`UPDATE \`guilds\` SET \`auto_voice_channel\` = '${JSON.stringify({ category_id: category.id, channel_id: channel.id })}' WHERE \`guild_id\` = '${channel.guild.id}'`, (err, res) => { if (err) console.log(err) })
                    }
                }
            })
        }
    },
    {
        name: "messageCreate",
        async run(client, message) {
            if (message.author.bot) return
            const this_guild_settings = await client.function.database.get_this_guild_settings(client, message.guildId)

            if (this_guild_settings?.music_player && message.channel.id === JSON.parse(this_guild_settings?.music_player).channel_id) return await client.function.music.play_music(client, message, this_guild_settings)

            const prefix = this_guild_settings?.custom_prefix ? this_guild_settings.custom_prefix : client.config.prefix
            if (message.content.startsWith(prefix)) {
                const args = message.content.slice(prefix.length).split(/\s+/)
                const command = args.shift().toLowerCase()
                run_commands(command, client, message, args)
            }

            if (this_guild_settings?.ranking_exp) {
                let data = JSON.parse(this_guild_settings.ranking_exp)
                if (data.some(m => m.member_id === message.author.id)) {
                    const member_data = data.find(m => m.member_id === message.author.id)
                    data.pop(member_data)
                    data.push({ member_id: member_data.member_id, score: member_data.score + 10 })
                } else data.push({ member_id: message.author.id, score: 10 })
                client.mysql.query(`UPDATE \`guilds\` SET \`ranking_exp\` = '${JSON.stringify(data)}' WHERE \`guild_id\` = '${message.guild.id}'`, (err, res) => { if (err) console.log(err) })
            }
        }
    },
    {
        name: "voiceStateUpdate",
        async run(client, oldMember, newMember) {
            // console.log(oldMember.channel) // null => join
            // console.log(newMember.channel) // null => left
            const m = oldMember || newMember

            const this_guild_settings = await client.function.database.get_this_guild_settings(client, oldMember.guild.id)

            if (this_guild_settings?.auto_voice_channel) {
                const main_channel = m.guild.channels.cache.get(JSON.parse(this_guild_settings.auto_voice_channel).channel_id)
                const category = m.guild.channels.cache.get(JSON.parse(this_guild_settings.auto_voice_channel).category_id)
                if (main_channel.members.size === 1 && main_channel.parent.id === JSON.parse(this_guild_settings.auto_voice_channel).category_id) {
                    const member = m.guild.members.cache.get(main_channel.members.map(m => m.user.id)[0])
                    m.guild.channels.create(`${member.user.username} - Create`, {
                        type: "GUILD_VOICE",
                        parent: category
                    }).then(async ch => await member.voice.setChannel(ch))
                }
                category.children.forEach(async channel => {
                    if (channel.id !== JSON.parse(this_guild_settings.auto_voice_channel).channel_id && channel.members.size === 0) try { await channel.delete() } catch (e) {}
                })
            }

            if (!newMember.channel && oldMember.id === client.user.id) {
                oldMember.guild.members.cache.get(client.user.id).setNickname(client.user.username)
                if (this_guild_settings?.music_player) {
                    let channel, msg
                    try {
                        channel = oldMember.guild.channels.cache.get(JSON.parse(this_guild_settings.music_player).channel_id)
                        msg = await channel.messages.fetch(JSON.parse(this_guild_settings.music_player).message_id)
                        if (channel.id && msg.id) {
                            msg.edit(client.utils.player_msg_default(client))
                        }
                    } catch (e) {
                        if (e instanceof TypeError) {
                            channel = await guild.channels.create(`🎶 ${client.user.username}`, { type: "GUILD_TEXT" })
                            msg = await channel.send(client.utils.player_msg_default(client))
                            return client.mysql.query(`UPDATE \`guilds\` SET \`music_player\` = '${JSON.stringify({ channel_id: channel.id, message_id: msg.id })}' WHERE \`guild_id\` = '${message.guild.id}'`, (err, res) => { if (err) console.log(err) })
                        }
                        msg = await channel.send(client.utils.player_msg_default(client))
                        client.mysql.query(`UPDATE \`guilds\` SET \`music_player\` = '${JSON.stringify({ channel_id: channel.id, message_id: msg.id })}' WHERE \`guild_id\` = '${message.guild.id}'`, (err, res) => { if (err) console.log(err) })
                    }
                }
            }
        }
    },
    {
        name: "interactionCreate",
        async run(client, interaction) {
            if (interaction.componentType === "BUTTON") {
                const this_guild_settings = await client.function.database.get_this_guild_settings(client, interaction.guildId)
                if (this_guild_settings?.music_player && interaction.channelId === JSON.parse(this_guild_settings?.music_player).channel_id) await client.function.music.player_manager(client, interaction)
            }
            if (!interaction.isCommand()) return
            const command = client.slashcommands.get(interaction.commandName)
            if (!command) return
            try {
                await command.run(client, interaction)
            } catch (error) {
                console.log(error)
                await interaction.reply({ content: 'เกิดข้อผิดพลาดค่ะ!'})
            }
        }
    },
    {
        name: "messageDelete",
        async run(client, message) {
            if (message.author.id === client.user.id) {
                const this_guild_settings = await client.function.database.get_this_guild_settings(client, message.guildId)
                if (this_guild_settings?.music_player && message.id === JSON.parse(this_guild_settings?.music_player).message_id) {
                    const msg = await message.channel.send(client.utils.player_msg_default(client))
                    client.mysql.query(`UPDATE \`guilds\` SET \`music_player\` = '${JSON.stringify({ channel_id: message.channel.id, message_id: msg.id })}' WHERE \`guild_id\` = '${message.guild.id}'`, (err, res) => { if (err) console.log(err) })
                    const player = client.manager.players.get(message.guild.id)
                    if (player) {
                        if (player.msg && player.playing && player.queue.current) {
                            player.msg = msg
                            player.msg.edit(client.utils.player_msg_playing(client, player))
                        }
                    }
                } 
            }
        }
    },
    {
        name: "channelDelete",
        async run(client, channel) {
            const this_guild_settings = await client.function.database.get_this_guild_settings(client, channel.guildId)
            if (this_guild_settings?.music_player && channel.id === JSON.parse(this_guild_settings?.music_player).channel_id) {
                const new_channel = await channel.guild.channels.create(`🎶 ${client.user.username}`, { type: "GUILD_TEXT", parent: channel.parentId })
                const msg = await new_channel.send(client.utils.player_msg_default(client))
                client.mysql.query(`UPDATE \`guilds\` SET \`music_player\` = '${JSON.stringify({ channel_id: new_channel.id, message_id: msg.id })}' WHERE \`guild_id\` = '${channel.guild.id}'`, (err, res) => { if (err) console.log(err) })
                const player = client.manager.players.get(channel.guildId)
                if (player) {
                    if (player.msg && player.playing && player.queue.current) {
                        player.msg = msg
                        player.msg.edit(client.utils.player_msg_playing(client, player))
                    }
                }
            }
            if (this_guild_settings?.auto_voice_channel) {
                if (channel.id === JSON.parse(this_guild_settings.auto_voice_channel).channel_id) {
                    const new_channel = await channel.guild.channels.create("join - create you room", { type: "GUILD_VOICE", parent: channel.parentId })
                    client.mysql.query(`UPDATE \`guilds\` SET \`auto_voice_channel\` = '${JSON.stringify({ category_id: channel.parentId, channel_id: new_channel.id })}' WHERE \`guild_id\` = '${channel.guild.id}'`, (err, res) => { if (err) console.log(err) })
                }
                if (channel.id === JSON.parse(this_guild_settings.auto_voice_channel).category_id) {
                    const new_category = await channel.guild.channels.create(`create room | ${client.user.username}`, { type: "GUILD_CATEGORY" })
                    const old_channel = channel.guild.channels.cache.get(JSON.parse(this_guild_settings.auto_voice_channel).channel_id)
                    old_channel.setParent(new_category)
                    client.mysql.query(`UPDATE \`guilds\` SET \`auto_voice_channel\` = '${JSON.stringify({ category_id: new_category.id, channel_id: old_channel.id })}' WHERE \`guild_id\` = '${channel.guild.id}'`, (err, res) => { if (err) console.log(err) })
                }
            }
        }
    },
    {
        name: "guildMemberAdd",
        async run(client, member) {
            const this_guild_settings = await client.function.database.get_this_guild_settings(client, member.guild.id)
            if (this_guild_settings?.welcome_channel_id) client.function.main.sendWelcomePic(member, member.guild.channels.cache.get(this_guild_settings.welcome_channel_id), "JOIN")
        }
    },
    {
        name: "guildMemberRemove",
        async run(client, member) {
            const this_guild_settings = await client.function.database.get_this_guild_settings(client, member.guild.id)
            if (this_guild_settings?.welcome_channel_id) client.function.main.sendWelcomePic(member, member.guild.channels.cache.get(this_guild_settings.welcome_channel_id), "LEFT")
        }
    },
    {
        name: "guildCreate",
        async run(client, guild) {
            client.cluster.broadcastEval(async (client, { log_channels , embed }) => {
                log_channels.forEach(async chid => {
                    const channel = await client.channels.fetch(chid)
                    if (channel) channel.send({embeds:[embed]})
                })
            },{
                context: {
                    log_channels: client.config.log_channels,
                    embed: new MessageEmbed({
                        author: {
                            name: "New invite!",
                            icon_url: guild.iconURL(),
                            url: client.config.embed_author_url
                        },
                        title: guild.name,
                        description: `ขณะนี้จำนวนเซิร์ฟเวอร์ของบอททั้งหมดอยู่ที่ ${(await client.guilds.fetch()).length.toLocaleString()} ค่ะ`,
                        color: 0x00ffff
                    })
                }
            })
        }
    },
    {
        name: "guildDelete",
        async run(client, guild) {
            client.cluster.broadcastEval(async (client, { log_channels , embed }) => {
                log_channels.forEach(async chid => {
                    const channel = await client.channels.fetch(chid)
                    if (channel) channel.send({embeds:[embed]})
                })
            },{
                context: {
                    log_channels: client.config.log_channels,
                    embed: new MessageEmbed({
                        author: {
                            name: "Kicked detected!",
                            icon_url: guild.iconURL(),
                            url: client.config.embed_author_url
                        },
                        title: guild.name,
                        description: `ขณะนี้จำนวนเซิร์ฟเวอร์ของบอททั้งหมดอยู่ที่ ${(await client.guilds.fetch()).length.toLocaleString()} ค่ะ`,
                        color: 0x00ffff
                    })
                }
            })
        }
    }
]

async function run_commands(command, client, message, args) {
    const cmd = client.commands.find(cmd => cmd.aliases?.includes(command)) ? client.commands.find(cmd => cmd.aliases?.includes(command)) : client.commands.get(command)
    if (!cmd) return
    if (cmd.category === "bot_admin" && !client.function.main.isAdmin(client, message.author.id)) return
    if (cmd.category === "guild_admin" && !message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return message.reply({embeds:[
        new MessageEmbed({
            author: {
                icon_url: client.user.avatarURL(),
                name: "ไม่สามารถดำเนินการได้ค่ะ!",
                url: client.config.embed_author_url
            },
            title: "คำสั่งนี้ใช้ได้แอดมินของดิสเท่านั้นค่ะ",
            color: 0x00ffff
        })
    ]})
    if (cmd.category === "rate" && !message.channel.nsfw) return message.reply({embeds:[
        new MessageEmbed({
            author: {
                icon_url: client.user.avatarURL(),
                name: "ไม่สามารถดำเนินการได้ค่ะ!",
                url: client.config.embed_author_url
            },
            title: "คำสั่งนี้ใช้ได้แค่กับห้อง NSFW เท่านั้นนะคะ",
            color: 0x00ffff
        })
    ]})
    message.loading = await message.reply({embeds:[
        new MessageEmbed({
            author: {
                icon_url: client.user.avatarURL(),
                name: "โปรดรอสักครู่นะคะ",
                url: client.config.embed_author_url
            },
            title: "กำลังทำการดึงข้อมูลค่ะ...",
            color: 0x00ffff
        })
    ]})
    await cmd.run(client, message, args).then(() => {
        console.log(`\nCommand use! | ${message.content} | ${message.guild.name} | ${message.author.tag}`)
        client.cluster.broadcastEval(async (client, { log_channels , embed }) => {
            log_channels.forEach(async chid => {
                const channel = await client.channels.fetch(chid)
                if (channel) channel.send({embeds:[embed]})
            })
        },{
            context: {
                log_channels: client.config.log_channels,
                embed: new MessageEmbed({
                    author: {
                        name: "Command use!",
                        icon_url: message.guild.iconURL(),
                        url: client.config.embed_author_url
                    },
                    title: message.content,
                    description: `${message.guild.name} | ${message.author.tag}`,
                    color: 0x00ffff
                })
            }
        })
    })
}