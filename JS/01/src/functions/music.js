const { MessageEmbed } = require('discord.js')
const { SpotifyTrack, SpotifyAlbum, SpotifyPlaylist, SpotifyArtist } = require('@liliaclient1/spotify')
const { splitBar } = require('string-progressbar') 
const request = require('request')

module.exports = [
    {
        name: "getTracks",
        async run(client, word) {
            const regex = new RegExp(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi)
            if (word.match(regex)) {
                const url = word.match(regex)[0]
                if (client.manager.spotify.isSpotifyUrl(url)) {
                    const item = await client.manager.spotify.load(url)
                    if (item instanceof SpotifyTrack) {
                        const track = await item.resolveLavalinkTrack()
                        return track
                    } else if (item instanceof SpotifyAlbum) {
                        const track = await item.resolveAllTracks()
                        return track
                    } else if (item instanceof SpotifyPlaylist) {
                        const track = await item.resolveAllTracks()
                        return track
                    } else if (item instanceof SpotifyArtist) {
                        const track = await item.resolveAllTracks()
                        return track
                    } else {
                        return "ERROR_MUSIC_NOT_FOUND_OK_NAJA"
                    }
                } else if (url.includes("youtube.com") || url.includes("youtu.be")) {
                    const results = await client.manager.search(cutUrl(url))
                    if (!results || results.tracks.length < 1) return "ERROR_MUSIC_NOT_FOUND_OK_NAJA"
                    const track = results.tracks
                    return track
                } else if (url.includes("https://soundcloud.com")) {
                    const res = await request.get({
                        url: url
                    }).catch(err => { console.log(err) })
                    try {
                        const results = await client.manager.search('https://soundcloud.com' + res.request.path);
                        if (!results || results.tracks.length < 1) return "ERROR_MUSIC_NOT_FOUND_OK_NAJA"
                        const track = results.tracks
                        return track
                    } catch (err) {
                        return "ERROR_MUSIC_NOT_FOUND_OK_NAJA"
                    }

                } else {
                    const results = await client.manager.search(url);
                    if (!results || results.tracks.length < 1) return "ERROR_MUSIC_NOT_FOUND_OK_NAJA"
                    const track = results.tracks[0]
                    return [track]
                }
            } else {
                const results = await client.manager.search("ytsearch:" + word);
                if (!results || results.tracks.length < 1) return "ERROR_MUSIC_NOT_FOUND_OK_NAJA"
                const track = results.tracks[0]
                return [track]
            }
        }
    },
    {
        name: "msToTime",
        run(duration) {
            let seconds = Math.floor((duration / 1000) % 60),
            minutes = Math.floor((duration / (1000 * 60)) % 60),
            hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
          
            hours = (hours < 10) ? "0" + hours : hours
            minutes = (minutes < 10) ? "0" + minutes : minutes
            seconds = (seconds < 10) ? "0" + seconds : seconds
          
            return hours + ":" + minutes + ":" + seconds
        }
    },
    {
        name: "progressbar",
        run(total, current, size) {
            return splitBar(total, current, size = size, line = '▬', slider = '🔘')[0]
        }
    },
    {
        name: "player_events",
        async run(client, message, player) {
            player.queue.on("trackStart", async queue => {
                message.guild.members.cache.get(client.user.id).setNickname(`🎶 ${queue.title.slice(0,28)}`)
                if (player.msg) {
                    return player.msg.edit(client.utils.player_msg_playing(client, player))
                }
                const this_guild_settings = await client.function.database.get_this_guild_settings(client, player.guild)
                if (this_guild_settings?.music_player) {
                    let channel, msg
                    try {
                        channel = message.guild.channels.cache.get(JSON.parse(this_guild_settings.music_player).channel_id)
                        msg = await channel.messages.fetch(JSON.parse(this_guild_settings.music_player).message_id)
                        if (channel.id && msg.id) {
                            player.msg = msg
                            player.msg.edit(client.utils.player_msg_playing(client, player))
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
            })
            player.queue.on("trackEnd", async queue => {
                message.guild.members.cache.get(client.user.id).setNickname(client.user.username)
                if (player.msg) {
                    player.msg.edit(client.utils.player_msg_default(client))
                }
                if (player.queue.tracks.length < 1) {
                    player.queue.started = false
                    if (player.autoplay) {
                        const res = await client.function.music.getTracks(client.manager, player, `https://www.youtube.com/watch?v=${queue.identifier}&list=RD${queue.identifier}`)
                        player.queue.add(res[(Math.floor(Math.random() * 10)) + 1], queue.requester)
                        if (!player.playing) player.queue.start()
                        return
                    }
                }
            })
        }
    },
    {
        name: "play_music",
        async run(client, message) {
            try {
                message.delete()
                const { channel } = message.member.voice
                if (!channel) return message.channel.send({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "ไม่พบช่องเสียงที่คุณอยู่ค่ะ",
                        color: 0x00ffff
                    })
                ]}).then(msg => setTimeout(() => msg.delete(), 5000))
                let player = client.manager.players.get(message.guild.id)
                if (!player) {
                    player = await client.manager.create(message.guild.id)
                    await player.connect(channel.id, { selfDeaf: true })
                    player.setVolume(50)
                    await client.function.music.player_events(client, message, player)
                    message.channel.send({embeds:[
                        new MessageEmbed({
                            author: {
                                icon_url: client.user.avatarURL(),
                                name: "ดำเนินการเรียบร้อยค่ะ!",
                                url: client.config.embed_author_url
                            },
                            title: `เชื่อมต่อไปยังช่องเสียง \`${channel.name}\` เรียบร้อยค่ะ!`,
                            color: 0x00ffff
                        })
                    ]}).then(msg => setTimeout(() => msg.delete(), 5000))
                } else {
                    if (player.channel != channel.id) {
                        const player_channel = message.guild.channels.cache.get(player.channel)
                        if (player.playing && player_channel.members.size > 1) {
                            return message.channel.send({embeds:[
                                new MessageEmbed({
                                    author: {
                                        icon_url: client.user.avatarURL(),
                                        name: "ไม่สามารถดำเนินการได้ค่ะ!",
                                        url: client.config.embed_author_url
                                    },
                                    title: "ดูเหมือนตอนนี้บอทจะไม่ได้เชื่อมต่อช่องเสียงของคุณอยู่นะคะ",
                                    description: `ขณะนี้มีคนใช้บอทอยู่ที่ช่องเสียง <#${player.channel}> ค่ะ`,
                                    color: 0x00ffff
                                })
                            ]}).then(msg => setTimeout(() => msg.delete(), 5000))
                        } else {
                            await player.connect(channel.id, { selfDeaf: true })
                            player.setVolume(50)
                            message.channel.send({embeds:[
                                new MessageEmbed({
                                    author: {
                                        icon_url: client.user.avatarURL(),
                                        name: "ดำเนินการเรียบร้อยค่ะ!",
                                        url: client.config.embed_author_url
                                    },
                                    title: `เชื่อมต่อไปยังช่องเสียง \`${channel.name}\` เรียบร้อยค่ะ!`,
                                    color: 0x00ffff
                                })
                            ]}).then(msg => setTimeout(() => msg.delete(), 5000))
                        }
                    }
                }
                const res = await client.function.music.getTracks(client, message.content)
                if (res === "ERROR_MUSIC_NOT_FOUND_OK_NAJA") return message.channel.send({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "ไม่พบผลการค้นหาของเพลงที่คุณขอมาค่ะ",
                        description: "ลองใช้ Keyword อื่นดูนะคะ หรือลองใช้เป็นลิงก์ดูค่ะ",
                        color: 0x00ffff
                    })
                ]}).then(msg => setTimeout(() => msg.delete(), 5000))
                player.queue.add(res, message.author)
                if (!player.playing) player.queue.start()
                if (res.length === 1) {
                    return message.channel.send({embeds:[
                        new MessageEmbed({
                            author: {
                                icon_url: client.user.avatarURL(),
                                name: "ดำเนินการเรียบร้อยค่ะ!",
                                url: client.config.embed_author_url
                            },
                            title: res[0].info.title,
                            url: res[0].info.uri,
                            description: "เพิ่มเพลงใหม่ไปยังคิว เรียบร้อยค่ะ",
                            thumbnail: {
                                url: `https://img.youtube.com/vi/${res[0].info.identifier}/mqdefault.jpg`
                            },
                            fields: [
                                {
                                    name: "ระยะเวลา",
                                    value: `\`${res[0].info.isStream ? "STREAM" : client.function.music.msToTime(res[0].info.length)}\``,
                                    inline: true
                                },
                                {
                                    name: "ขอเพลงโดย",
                                    value: `<@!${message.author.id}>`,
                                    inline: true
                                },
                                {
                                    name: "เล่นเพลงอยู่ที่ห้อง",
                                    value: `<#${player.channel}>`,
                                    inline: true
                                }
                            ],
                            color: 0x00ffff
                        })
                    ]}).then(msg => setTimeout(() => msg.delete(), 5000))
                }
        
                function generateEmbed(start) {
                    const current = res.slice(start, start + 10)
        
                    return new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ดำเนินการเรียบร้อยค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "Platlist",
                        url: args.join(" "),
                        description: `เพิ่มเพลงจากเพลย์ลิสต์ทั้งหมด ${res.length} เพลง ไปยังคิวเรียบร้อยค่ะ!`,
                        thumbnail: {
                            url: `https://img.youtube.com/vi/${current[0].info.identifier}/mqdefault.jpg`
                        },
                        fields: current.map(s => ({
                            name:`${res.indexOf(s) + 1}) ${s.info.title}`,
                            value:`*${s.info.isStream ? "STREAM" : client.function.music.msToTime(s.info.length)}* | ${s.info.author}`
                        })),
                        color: 0x00ffff
                    })
                }
        
                const canFitOnOnePage = res.length <= 10
                const embedMessage = await message.channel.send({
                    embeds: [generateEmbed(0)],
                    components: canFitOnOnePage
                        ? []
                        : [new MessageActionRow({components: [forwardButton]})]
                    }).then(msg => setTimeout(() => msg.delete(), 10000))
        
                if (canFitOnOnePage) return
        
                const collector = embedMessage.createMessageComponentCollector({
                    filter: ({user}) => user.id === message.author.id, time: 30 * 60000
                })
        
                let currentIndex = 0
                collector.on('collect', async interaction => {
                    interaction.customId === 'back' ? (currentIndex -= 10) : (currentIndex += 10)
                    await interaction.update({
                        embeds: [generateEmbed(currentIndex)],
                        components: [
                        new MessageActionRow({
                            components: [
                            ...(currentIndex ? [backButton] : []),
                            ...(currentIndex + 10 < res.length ? [forwardButton] : [])
                            ]
                        })
                        ]
                    })
                })
            } catch (e) {
                console.log(e)
                message.channel.send({embeds:[
                    new MessageEmbed({
                        author: {
                            name: "เกิดข้อผิดพลาดค่ะ",
                            icon_url: client.user.avatarURL({ dynamic:true }),
                            url: client.config.embed_author_url
                        },
                        color: 0x00ffff
                    })
                ]}).then(msg => setTimeout(() => msg.delete(), 5000))
            }
        }
    },
    {
        name: "player_manager",
        async run(client, interaction) {
            interaction.deferUpdate()
            const player = client.manager.players.get(interaction.guildId)
            if (!player) return interaction.channel.send({embeds:[
                new MessageEmbed({
                    author: {
                        icon_url: client.user.avatarURL(),
                        name: "ไม่สามารถดำเนินการได้ค่ะ!",
                        url: client.config.embed_author_url
                    },
                    title: "ดูเหมือนตอนนี้บอทจะไม่ได้เชื่อมต่อช่องเสียงอยู่นะคะ",
                    color: 0x00ffff
                })
            ]}).then(msg => setTimeout(() => msg.delete(), 5000))
            const { channel } = interaction.member.voice
            if (player.channel != channel.id) return interaction.channel.send({embeds:[
                new MessageEmbed({
                    author: {
                        icon_url: client.user.avatarURL(),
                        name: "ไม่สามารถดำเนินการได้ค่ะ!",
                        url: client.config.embed_author_url
                    },
                    title: "ดูเหมือนตอนนี้บอทจะไม่ได้เชื่อมต่อช่องเสียงของคุณอยู่นะคะ",
                    description: `ขณะนี้มีคนใช้บอทอยู่ที่ช่องเสียง <#${player.channel}> ค่ะ`,
                    color: 0x00ffff
                })
            ]}).then(msg => setTimeout(() => msg.delete(), 5000))
            if (interaction.customId === "leave") {
                client.manager.destroy(interaction.guildId)
                return interaction.channel.send({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ดำเนินการเรียบร้อยค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: `ตัดการเชื่อมต่อจากช่องเสียง \`${channel.name}\` เรียบร้อยค่ะ!`,
                        color: 0x00ffff
                    })
                ]}).then(msg => setTimeout(() => msg.delete(), 5000))
            }
            if (!player.queue.current) return interaction.channel.send({embeds:[
                new MessageEmbed({
                    author: {
                        icon_url: client.user.avatarURL(),
                        name: "ไม่สามารถดำเนินการได้ค่ะ!",
                        url: client.config.embed_author_url
                    },
                    title: "ไม่มีเพลงที่กำลังเล่นอยู่ในขณะนี้ค่ะ",
                    color: 0x00ffff
                })
            ]}).then(msg => setTimeout(() => msg.delete(), 5000))
            if (interaction.customId === "looptrk") {
                if (!player.queue._loop || player.queue._loop === "undefined") {
                    player.queue.loop("song")
                    interaction.message.edit(client.utils.player_msg_playing(client, player))
                    return interaction.channel.send({embeds:[
                        new MessageEmbed({
                            author: {
                                icon_url: client.user.avatarURL(),
                                name: "ดำเนินการเรียบร้อยค่ะ!",
                                url: client.config.embed_author_url
                            },
                            title: "ตั้งค่าการเล่นซ้ำเป็นโหมด `song` เรียบร้อยค่ะ",
                            color: 0x00ffff
                        })
                    ]}).then(msg => setTimeout(() => msg.delete(), 5000))
                }
                if (player.queue._loop === "song") {
                    player.queue.loop("undefined")
                    interaction.message.edit(client.utils.player_msg_playing(client, player))
                    interaction.channel.send({embeds:[
                        new MessageEmbed({
                            author: {
                                icon_url: client.user.avatarURL(),
                                name: "ดำเนินการเรียบร้อยค่ะ!",
                                url: client.config.embed_author_url
                            },
                            title: "ปิดการตั้งค่า Loop เรียบร้อยค่ะ",
                            color: 0x00ffff
                        })
                    ]}).then(msg => setTimeout(() => msg.delete(), 5000))
                }
            }
            if (interaction.customId === "previous") {
                player.queue.previou()
                interaction.channel.send({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ดำเนินการเรียบร้อยค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "กำลังเล่นเพลงก่อนหน้านี้ในคิวค่ะ",
                        color: 0x00ffff
                    })
                ]}).then(msg => setTimeout(() => msg.delete(), 5000))
            }
            if (interaction.customId === "play") {
                if (player.paused) {
                    player.pause(false)
                    return interaction.channel.send({embeds:[
                        new MessageEmbed({
                            author: {
                                icon_url: client.user.avatarURL(),
                                name: "ดำเนินการเรียบร้อยค่ะ!",
                                url: client.config.embed_author_url
                            },
                            title: "เล่นเพลงต่อเรียบร้อยค่ะ",
                            color: 0x00ffff
                        })
                    ]}).then(msg => setTimeout(() => msg.delete(), 5000))
                }
                player.pause()
                interaction.channel.send({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ดำเนินการเรียบร้อยค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "พักการเล่นเพลงเรียบร้อยค่ะ",
                        color: 0x00ffff
                    })
                ]}).then(msg => setTimeout(() => msg.delete(), 5000))
            }
            if (interaction.customId === "skip") {
                if (player.queue.tracks.length < 1) return interaction.channel.send({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "ไม่มีเพลงในคิวให้ข้ามแล้วค่ะ",
                        color: 0x00ffff
                    })
                ]}).then(msg => setTimeout(() => msg.delete(), 5000))
                player.queue.skip()
                interaction.channel.send({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ดำเนินการเรียบร้อยค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "กำลังเล่นเพลงถัดไปในคิวค่ะ",
                        color: 0x00ffff
                    })
                ]}).then(msg => setTimeout(() => msg.delete(), 5000))
            }
            if (interaction.customId === "loopq") {
                if (player.queue._loop !== "queue" || !player.queue._loop || player.queue._loop === "undefined") {
                    player.queue.loop("queue")
                    interaction.message.edit(client.utils.player_msg_playing(client, player))
                    return interaction.channel.send({embeds:[
                        new MessageEmbed({
                            author: {
                                icon_url: client.user.avatarURL(),
                                name: "ดำเนินการเรียบร้อยค่ะ!",
                                url: client.config.embed_author_url
                            },
                            title: "ตั้งค่าการ Loop เป็นโหมด `queue` เรียบร้อยค่ะ",
                            color: 0x00ffff
                        })
                    ]}).then(msg => setTimeout(() => msg.delete(), 5000))
                }
                if (player.queue._loop === "queue") {
                    player.queue.loop("undefined")
                    interaction.message.edit(client.utils.player_msg_playing(client, player))
                    interaction.channel.send({embeds:[
                        new MessageEmbed({
                            author: {
                                icon_url: client.user.avatarURL(),
                                name: "ดำเนินการเรียบร้อยค่ะ!",
                                url: client.config.embed_author_url
                            },
                            title: "ปิดการตั้งค่า Loop เรียบร้อยค่ะ",
                            color: 0x00ffff
                        })
                    ]}).then(msg => setTimeout(() => msg.delete(), 5000))
                }
            }
            if (interaction.customId === "volup") {
                const volume_before = player.volume
                if (volume_before === 150) return interaction.channel.send({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "ไม่สามารถเพิ่มระดับเสียงขึ้นได้มากกว่านี้แล้วค่ะ",
                        color: 0x00ffff
                    })
                ]}).then(msg => setTimeout(() => msg.delete(), 5000))
                player.setVolume(volume_before + 10)
                interaction.message.edit(client.utils.player_msg_playing(client, player))
                interaction.channel.send({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ดำเนินการเรียบร้อยค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: `เพิ่มระดับเสียง จาก \`${volume_before}\` เป็น \`${player.volume}\` เรียบร้อยค่ะ`,
                        color: 0x00ffff
                    })
                ]}).then(msg => setTimeout(() => msg.delete(), 5000))
            }
            if (interaction.customId === "voldown") {
                const volume_before = player.volume
                if (volume_before === 0) return interaction.channel.send({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "ไม่สามารถลดระดับเสียงลงได้มากกว่านี้แล้วค่ะ",
                        color: 0x00ffff
                    })
                ]}).then(msg => setTimeout(() => msg.delete(), 5000))
                player.setVolume(volume_before - 10)
                interaction.message.edit(client.utils.player_msg_playing(client, player))
                interaction.channel.send({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ดำเนินการเรียบร้อยค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: `ลดระดับเสียง จาก \`${volume_before}\` เป็น \`${player.volume}\` เรียบร้อยค่ะ`,
                        color: 0x00ffff
                    })
                ]}).then(msg => setTimeout(() => msg.delete(), 5000))
            }
            if (interaction.customId === "mute") {
                if (player.volume === 0) {
                    player.setVolume(50)
                    interaction.message.edit(client.utils.player_msg_playing(client, player))
                    return interaction.channel.send({embeds:[
                        new MessageEmbed({
                            author: {
                                icon_url: client.user.avatarURL(),
                                name: "ดำเนินการเรียบร้อยค่ะ!",
                                url: client.config.embed_author_url
                            },
                            title: `เปิดเสียงบอทเรียบร้อยค่ะ`,
                            color: 0x00ffff
                        })
                    ]}).then(msg => setTimeout(() => msg.delete(), 5000))
                }
                player.setVolume(0)
                interaction.message.edit(client.utils.player_msg_playing(client, player))
                interaction.channel.send({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ดำเนินการเรียบร้อยค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: `ปิดเสียงบอทเรียบร้อยค่ะ`,
                        color: 0x00ffff
                    })
                ]}).then(msg => setTimeout(() => msg.delete(), 5000))
            }
            if (interaction.customId === "sf") {
                player.queue.shuffle()
                interaction.channel.send({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ดำเนินการเรียบร้อยค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "สุ่มเพลงในคิวเรียบร้อยค่ะ",
                        description: "ใช้คำสั่ง queue เพิ่มดูการเปลี่ยนแปลงได้เลยค่ะ",
                        color: 0x00ffff
                    })
                ]}).then(msg => setTimeout(() => msg.delete(), 5000))
            }
        }
    }
]

function cutUrl(url) {
    var queryStart = url.indexOf("?") + 1,
        queryEnd = url.indexOf("#") + 1 || url.length + 1,
        query = url.slice(queryStart, queryEnd - 1),
        pairs = query.replace(/\+/g, " ").split("&"),
        parms = {}, i, n, v, nv;

    if (query === url || query === "") return url;
    for (i = 0; i < pairs.length; i++) {
        nv = pairs[i].split("=", 2);
        n = decodeURIComponent(nv[0]);
        v = decodeURIComponent(nv[1]);

        if (!parms.hasOwnProperty(n)) parms[n] = [];
        parms[n].push(nv.length === 2 ? v : null);
    }

    if (parms.list && !parms.v) {
        return `https://www.youtube.com/playlist?list=${parms.list}`
    } else if (parms.v && parms.list) {
        return `https://www.youtube.com/watch?v=${parms.v}&list=${parms.list}`
    } else if (parms.v) {
        return "https://youtu.be/" + parms.v
    } else {
        return "https://youtu.be/" + parms.v
    }
}