const { MessageEmbed , MessageButton , MessageActionRow} = require('discord.js')

const backButton = new MessageButton({
    style: 'SECONDARY',
    label: "ก่อนหน้า",
    emoji: "⬅️",
    customId: 'back'
})
const forwardButton = new MessageButton({
    style: 'SECONDARY',
    label: "หน้าถัดไป",
    emoji: "➡️",
    customId: 'forward'
})

module.exports = [
    {
        name: "join",
        aliases: ["connect"],
        category: "music",
        information: "บอทจะเชื่อมห้องเสียงที่คุณอยู่ค่ะ",
        async run(client, message) {
            try {
                const { channel } = message.member.voice
                if (!channel) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "ไม่พบช่องเสียงที่คุณอยู่ค่ะ",
                        color: 0x00ffff
                    })
                ]})
                let player = client.manager.players.get(message.guild.id)
                if (!player) {
                    player = await client.manager.create(message.guild.id)
                    await player.connect(channel.id, { selfDeaf: true })
                    player.setVolume(50)
                    await client.function.music.player_events(client, message, player)
                    return message.loading.edit({embeds:[
                        new MessageEmbed({
                            author: {
                                icon_url: client.user.avatarURL(),
                                name: "ดำเนินการเรียบร้อยค่ะ!",
                                url: client.config.embed_author_url
                            },
                            title: `เชื่อมต่อไปยังช่องเสียง \`${channel.name}\` เรียบร้อยค่ะ!`,
                            color: 0x00ffff
                        })
                    ]})
                }
                if (player.channel != channel.id) {
                    const player_channel = message.guild.channels.cache.get(player.channel)
                    if (player.playing && player_channel.members.size > 1) {
                        message.loading.edit({embeds:[
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
                        ]})
                    } else {
                        await player.connect(channel.id, { selfDeaf: true })
                        player.setVolume(50)
                        await client.function.music.player_events(client, message, player)
                        message.loading.edit({embeds:[
                            new MessageEmbed({
                                author: {
                                    icon_url: client.user.avatarURL(),
                                    name: "ดำเนินการเรียบร้อยค่ะ!",
                                    url: client.config.embed_author_url
                                },
                                title: `เชื่อมต่อไปยังช่องเสียง \`${channel.name}\` เรียบร้อยค่ะ!`,
                                color: 0x00ffff
                            })
                        ]})
                    }
                } else {
                    message.loading.edit({embeds:[
                        new MessageEmbed({
                            author: {
                                icon_url: client.user.avatarURL(),
                                name: "ไม่สามารถดำเนินการได้ค่ะ!",
                                url: client.config.embed_author_url
                            },
                            title: `เชื่อมต่อช่องเสียงที่คุณอยู่ อยู่แล้วค่ะ`,
                            color: 0x00ffff
                        })
                    ]})
                }
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
    {
        name: "play",
        aliases: ["p"],
        category: "music",
        information: "บอทจะเล่นเพลงตามที่คุณขอค่ะ",
        async run(client, message, args) {
            try {
                const { channel } = message.member.voice
                if (!channel) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "ไม่พบช่องเสียงที่คุณอยู่ค่ะ",
                        color: 0x00ffff
                    })
                ]})
                let player = client.manager.players.get(message.guild.id)
                if (!player) {
                    player = await client.manager.create(message.guild.id)
                    await player.connect(channel.id, { selfDeaf: true })
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
                    ]}).then(m => setTimeout(() => m.delete(), 5000))
                } else {
                    if (player.channel != channel.id) {
                        const player_channel = message.guild.channels.cache.get(player.channel)
                        if (player.playing && player_channel.members.size > 1) {
                            return message.loading.edit({embeds:[
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
                            ]})
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
                                }).then(m => setTimeout(() => m.delete(), 5000))
                            ]})
                        }
                    }
                }
                if (!args[0]) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "โปรดระบุเพลงที่ต้องการจะให้เล่นด้วยนะคะ",
                        color: 0x00ffff
                    })
                ]})
                const res = await client.function.music.getTracks(client, args.join(" "))
                if (res === "ERROR_MUSIC_NOT_FOUND_OK_NAJA") return message.loading.edit({embeds:[
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
                ]})
                player.queue.add(res, message.author)
                if (!player.playing) player.queue.start()
                if (res.length === 1) {
                    return message.loading.edit({embeds:[
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
                    ]})
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
                const embedMessage = await message.loading.edit({
                    embeds: [generateEmbed(0)],
                    components: canFitOnOnePage
                        ? []
                        : [new MessageActionRow({components: [forwardButton]})]
                    })
    
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
                client.function.main.error_log(e, client, message)
            }
        }
    },
    {
        name: "pause",
        category: "music",
        information: "พักการเล่นเพลง",
        async run(client, message) {
            try {
                const player = client.manager.players.get(message.guild.id)
                if (!player) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "ดูเหมือนตอนนี้บอทจะไม่ได้เชื่อมต่อช่องเสียงอยู่นะคะ",
                        color: 0x00ffff
                    })
                ]})
                const { channel } = message.member.voice
                if (player.channel != channel.id) return message.loading.edit({embeds:[
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
                ]})
                if (!player.queue.current) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "ไม่มีเพลงที่กำลังเล่นอยู่ในขณะนี้ค่ะ",
                        color: 0x00ffff
                    })
                ]})
                if (player.paused) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "ขณะนี้บอทพักการเล่นอยู่แล้วค่ะ",
                        color: 0x00ffff
                    })
                ]})
                player.pause()
                message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ดำเนินการเรียบร้อยค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "พักการเล่นเพลงเรียบร้อยค่ะ",
                        color: 0x00ffff
                    })
                ]})
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
    {
        name: "resume",
        category: "music",
        information: "เล่นเพลงต่อ",
        async run(client, message) {
            try {
                const player = client.manager.players.get(message.guild.id)
                if (!player) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "ดูเหมือนตอนนี้บอทจะไม่ได้เชื่อมต่อช่องเสียงอยู่นะคะ",
                        color: 0x00ffff
                    })
                ]})
                const { channel } = message.member.voice
                if (player.channel != channel.id) return message.loading.edit({embeds:[
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
                ]})
                if (!player.queue.current) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "ไม่มีเพลงที่กำลังเล่นอยู่ในขณะนี้ค่ะ",
                        color: 0x00ffff
                    })
                ]})
                if (!player.paused && player.playing) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "ขณะนี้บอทเล่นเพลงอยู่แล้วค่ะ",
                        color: 0x00ffff
                    })
                ]})
                player.pause(false)
                message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ดำเนินการเรียบร้อยค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "เล่นเพลงต่อเรียบร้อยค่ะ",
                        color: 0x00ffff
                    })
                ]})
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
    {
        name: "queue",
        aliases: ["q"],
        category: "music",
        information: "ดูคิวของเพลงทั้งหมด",
        async run(client, message) {
            try {
                const player = client.manager.players.get(message.guild.id)
                if (!player) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "ดูเหมือนตอนนี้บอทจะไม่ได้เชื่อมต่อช่องเสียงอยู่นะคะ",
                        color: 0x00ffff
                    })
                ]})
                if (player.queue.tracks.length === 0) {
                    if (!player.queue.current) return message.loading.edit({embeds:[
                        new MessageEmbed({
                            author: {
                                icon_url: client.user.avatarURL(),
                                name: "ไม่สามารถดำเนินการได้ค่ะ!",
                                url: client.config.embed_author_url
                            },
                            title: "ขณะนี้ไม่มีเพลงในคิวแล้วค่ะ",
                            color: 0x00ffff
                        })
                    ]})
                    return message.loading.edit({embeds:[
                        new MessageEmbed({
                            author: {
                                icon_url: message.guild.iconURL(),
                                name: `นี่คือคิวเพลงของดิส ${message.guild.name} ค่ะ`,
                                url: client.config.embed_author_url
                            },
                            title: "ขณะนี้ไม่มีเพลงในคิวแล้วค่ะ",
                            fields: [
                                {
                                    name:
                                        `ขณะนี้กำลังเล่นเพลง\n` +
                                        `${client.function.music.msToTime(player.queue.current.position)} / ${client.function.music.msToTime(player.queue.current.length)}\n` +
                                        `${client.function.music.progressbar(player.queue.current.length, player.queue.current.position, 26)}\n` +
                                        `${player.queue.current.title}`,
                                    value: `*${client.function.music.msToTime(player.queue.current.length)}* | ${player.queue.current.author} | ขอเพลงโดย <@!${player.queue.current.requester}>`
                                }
                            ],
                            color: 0x00ffff
                        })
                    ]})
                }

                function generateEmbed(start) {
                    const current = player.queue.tracks.slice(start, start + 10)

                    return new MessageEmbed({
                        author: {
                            icon_url: message.guild.iconURL(),
                            name: `นี่คือคิวเพลงของดิส ${message.guild.name} ค่ะ`,
                            url: client.config.embed_author_url
                        },
                        title: `มีเพลงในคิวทั้งหมด ${player.queue.tracks.length} เพลง`,
                        description: `นี่คือเพลงที่ ${start + 1} ถึงเพลงที่ ${start + current.length}`,
                        fields: [
                            current.map(s => ({
                                name:`${player.queue.tracks.indexOf(s) + 1}) ${s.title}`,
                                value:`*${client.function.music.msToTime(s.length)}* | ${s.author} | ขอเพลงโดย <@!${s.requester}>`
                            })),
                            {
                                name: `ขณะนี้กำลังเล่นเพลง\n${client.function.music.msToTime(player.queue.current.position)} / ${client.function.music.msToTime(player.queue.current.length)}`,
                                value: `${client.function.music.progressbar(player.queue.current.length, player.queue.current.position, 26)}`,
                                inline: false
                            },
                            {
                                name: "จากช่อง",
                                value: "`" + player.queue.current.author + "`",
                                inline: true
                            },
                            {
                                name: 'ขอเพลงโดย',
                                value: `<@!${player.queue.current.requester}>`,
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
                }

                const canFitOnOnePage = player.queue.tracks.length <= 10
                const embedMessage = await message.loading.edit({
                    embeds: [generateEmbed(0)],
                    components: canFitOnOnePage
                        ? []
                        : [new MessageActionRow({components: [forwardButton]})]
                    })
    
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
                            ...(currentIndex + 10 < player.queue.tracks.length ? [forwardButton] : [])
                            ]
                        })
                        ]
                    })
                })
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
    {
        name: "nowplaying",
        aliases: ["np"],
        category: "music",
        information: "ดูเพลงที่กำลังเล่นขณะนี้",
        async run(client, message) {
            try {
                const player = client.manager.players.get(message.guild.id)
                if (!player) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "ดูเหมือนตอนนี้บอทจะไม่ได้เชื่อมต่อช่องเสียงอยู่นะคะ",
                        color: 0x00ffff
                    })
                ]})
                if (!player.queue.current) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "ไม่มีเพลงที่กำลังเล่นอยู่ในขณะนี้ค่ะ",
                        color: 0x00ffff
                    })
                ]})
                message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "เพลงที่กำลังเล่นอยู่ในขณะนี้",
                            url: client.config.embed_author_url
                        },
                        title: player.queue.current.title,
                        url: player.queue.current.uri,
                        fields: [
                            {
                                name: `${client.function.music.msToTime(player.queue.current.position)} / ${client.function.music.msToTime(player.queue.current.length)}`,
                                value: `${client.function.music.progressbar(player.queue.current.length, player.queue.current.position, 26)}`,
                                inline: false
                            },
                            {
                                name: "จากช่อง",
                                value: "`" + player.queue.current.author + "`",
                                inline: true
                            },
                            {
                                name: 'ขอเพลงโดย',
                                value: `<@!${player.queue.current.requester}>`,
                                inline: true
                            },
                            {
                                name: "เล่นเพลงอยู่ที่ห้อง",
                                value: `<#${player.channel}>`,
                                inline: true
                            }
                        ],
                        image: {
                            url: `https://img.youtube.com/vi/${player.queue.current.identifier}/maxresdefault.jpg`
                        },
                        footer: {
                            text: `เล่นอยู่ที่ node [${player.socket.id}]`
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
        name: "volume",
        aliases: ["vol"],
        category: "music",
        information: "ปรับระดับเสียงของเพลง",
        async run(client, message, args) {
            try {
                const player = client.manager.players.get(message.guild.id)
                if (!player) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "ดูเหมือนตอนนี้บอทจะไม่ได้เชื่อมต่อช่องเสียงอยู่นะคะ",
                        color: 0x00ffff
                    })
                ]})
                const { channel } = message.member.voice
                if (player.channel != channel.id) return message.loading.edit({embeds:[
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
                ]})
                if (!player.queue.current) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "ไม่มีเพลงที่กำลังเล่นอยู่ในขณะนี้ค่ะ",
                        color: 0x00ffff
                    })
                ]})
                if (!args[0]) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "โปรดระบุระดับเสียงที่ต้องการปรับด้วยนะคะ",
                        description: `เช่น \`${client.function.main.get_prefix(client, message)}vol 38\``,
                        color: 0x00ffff
                    })
                ]})
                if (!isNumeric(args[0])) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "โปรดระบุระดับเสียงที่ต้องการปรับให้ถูกต้องด้วยนะคะ",
                        description: `เช่น \`${client.function.main.get_prefix(client, message)}vol 38\``,
                        color: 0x00ffff
                    })
                ]})
                if (parseInt(args[0]) > 150 || parseInt(args[0]) < 1) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "สามารถตั้งค่าระดับเสียง ได้เพียง 1 - 150 เท่านั้นนะคะ",
                        color: 0x00ffff
                    })
                ]})
                const volume_before = player.volume
                player.setVolume(args[0])
                message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ดำเนินการเรียบร้อยค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: `ปรับระดับเสียง จาก \`${volume_before}\` ไปที่ \`${args[0]}\` เรียบร้อยค่ะ`,
                        color: 0x00ffff
                    })
                ]})
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
    {
        name: "equalizer",
        aliases: ["eq"],
        category: "music",
        information: "ปรับ equalizer ของเพลง",
        async run(client, message, args) {
            try {
                const player = client.manager.players.get(message.guild.id)
                if (!player) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "ดูเหมือนตอนนี้บอทจะไม่ได้เชื่อมต่อช่องเสียงอยู่นะคะ",
                        color: 0x00ffff
                    })
                ]})
                const { channel } = message.member.voice
                if (player.channel != channel.id) return message.loading.edit({embeds:[
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
                ]})
                if (!player.queue.current) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "ไม่มีเพลงที่กำลังเล่นอยู่ในขณะนี้ค่ะ",
                        color: 0x00ffff
                    })
                ]})
                if (args[0] & args[0] != "nightcore" & args[0] != "nc" & args[0] != "vaporwave" & args[0] != "vw") return message.loading.edit({embeds:[
                    new MessageEmbed({
                        title: "ไม่สามารถดำเนินการได้ค่ะ!",
                        description: "โปรดระบุโหมดให้ถูกต้องด้วยนะคะ | nightcore / vaporwave",
                        color: 0x00ffff
                    })
                ]})
                if (args[0] === "nightcore" || args[0] === "nc") {
                    if (player.nightcore) {
                        player.nightcore = false
                        return message.loading.edit({embeds:[
                            new MessageEmbed({
                                author: {
                                    icon_url: client.user.avatarURL(),
                                    name: "ดำเนินการเรียบร้อยค่ะ!",
                                    url: client.config.embed_author_url
                                },
                                title: "รีเซ็ตการตั้งค่า equalizer เรียบร้อยค่ะ",
                                color: 0x00ffff
                            })
                        ]})
                    }
                    player.nightcore = true
                    return message.loading.edit({embeds:[
                        new MessageEmbed({
                            author: {
                                icon_url: client.user.avatarURL(),
                                name: "ดำเนินการเรียบร้อยค่ะ!",
                                url: client.config.embed_author_url
                            },
                            title: "ตั้งค่า equalizer เป็นโหมด \`nightcore\` เรียบร้อยค่ะ",
                            color: 0x00ffff
                        })
                    ]})
                }
                if (args[0] === "vaporwave" || args[0] === "vw") {
                    if (player.vaporwave) {
                        player.vaporwave = false
                        return message.loading.edit({embeds:[
                            new MessageEmbed({
                                author: {
                                    icon_url: client.user.avatarURL(),
                                    name: "ดำเนินการเรียบร้อยค่ะ!",
                                    url: client.config.embed_author_url
                                },
                                title: "รีเซ็ตการตั้งค่า equalizer เรียบร้อยค่ะ",
                                color: 0x00ffff
                            })
                        ]})
                    }
                    player.vaporwave = true
                    return message.loading.edit({embeds:[
                        new MessageEmbed({
                            author: {
                                icon_url: client.user.avatarURL(),
                                name: "ดำเนินการเรียบร้อยค่ะ!",
                                url: client.config.embed_author_url
                            },
                            title: "ตั้งค่า equalizer เป็นโหมด \`vaporwave\` เรียบร้อยค่ะ",
                            color: 0x00ffff
                        })
                    ]})
                }
                player.reset()
                message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ดำเนินการเรียบร้อยค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "รีเซ็ตการตั้งค่า equalizer เรียบร้อยค่ะ",
                        color: 0x00ffff
                    })
                ]})
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
    {
        name: "loop",
        aliases: ["repeat"],
        category: "music",
        information: "เปิดการเล่นซ้ำ",
        async run(client, message, args) {
            try {
                const player = client.manager.players.get(message.guild.id)
                if (!player) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "ดูเหมือนตอนนี้บอทจะไม่ได้เชื่อมต่อช่องเสียงอยู่นะคะ",
                        color: 0x00ffff
                    })
                ]})
                const { channel } = message.member.voice
                if (player.channel != channel.id) return message.loading.edit({embeds:[
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
                ]})
                if (!player.queue.current) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "ไม่มีเพลงที่กำลังเล่นอยู่ในขณะนี้ค่ะ",
                        color: 0x00ffff
                    })
                ]})
                if (args[0] != "queue") return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "โปรดระบุโหมดให้ถูกต้องด้วยนะคะ",
                        description: `เช่น \`${client.function.main.get_prefix(client, message)}loop / loop queue\``,
                        color: 0x00ffff
                    })
                ]})
                if (!player.queue._loop && args[0] !== "queue") {
                    player.queue.loop("song")
                    return message.loading.edit({embeds:[
                        new MessageEmbed({
                            author: {
                                icon_url: client.user.avatarURL(),
                                name: "ดำเนินการเรียบร้อยค่ะ!",
                                url: client.config.embed_author_url
                            },
                            title: "ตั้งค่าการเล่นซ้ำเป็นโหมด `song` เรียบร้อยค่ะ",
                            color: 0x00ffff
                        })
                    ]})
                }
                if (player.queue._loop === "song" && args[0] !== "queue") {
                    player.queue.loop("undefined")
                    return message.loading.edit({embeds:[
                        new MessageEmbed({
                            author: {
                                icon_url: client.user.avatarURL(),
                                name: "ดำเนินการเรียบร้อยค่ะ!",
                                url: client.config.embed_author_url
                            },
                            title: "ปิดการตั้งค่า Loop เรียบร้อยค่ะ",
                            color: 0x00ffff
                        })
                    ]})
                }
                if (player.queue._loop !== "queue" && args[0] === "queue") {
                    player.queue.loop("queue")
                    return message.loading.edit({embeds:[
                        new MessageEmbed({
                            author: {
                                icon_url: client.user.avatarURL(),
                                name: "ดำเนินการเรียบร้อยค่ะ!",
                                url: client.config.embed_author_url
                            },
                            title: "ตั้งค่าการ Loop เป็นโหมด `queue` เรียบร้อยค่ะ",
                            color: 0x00ffff
                        })
                    ]})
                }
                if (player.queue._loop === "queue" && args[0] === "queue") {
                    player.queue.loop("undefined")
                    return message.loading.edit({embeds:[
                        new MessageEmbed({
                            author: {
                                icon_url: client.user.avatarURL(),
                                name: "ดำเนินการเรียบร้อยค่ะ!",
                                url: client.config.embed_author_url
                            },
                            title: "ปิดการตั้งค่า Loop เรียบร้อยค่ะ",
                            color: 0x00ffff
                        })
                    ]})
                }
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
    {
        name: "seek",
        category: "music",
        information: "กรอเพลง",
        async run(client, message, args) {
            try {
                const player = client.manager.players.get(message.guild.id)
                if (!player) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "ดูเหมือนตอนนี้บอทจะไม่ได้เชื่อมต่อช่องเสียงอยู่นะคะ",
                        color: 0x00ffff
                    })
                ]})
                const { channel } = message.member.voice
                if (player.channel != channel.id) return message.loading.edit({embeds:[
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
                ]})
                if (!player.queue.current) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "ไม่มีเพลงที่กำลังเล่นอยู่ในขณะนี้ค่ะ",
                        color: 0x00ffff
                    })
                ]})
                if (!player.queue.current.isSeekable) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "เพลงที่เล่นอยู่ขณะนี้ไม่สามารถกรอได้ค่ะ",
                        color: 0x00ffff
                    })
                ]})
                if (!args[0]) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "โปรดระบุตำแหน่งของเพลงที่ต้องการจะกรอด้วยนะคะ",
                        description: `เช่น \`${client.function.main.get_prefix(client, message)}seek 1:23\``,
                        color: 0x00ffff
                    })
                ]})
                if (!args[0].match(/^[0-5]?[0-9](:[0-5][0-9]){1,2}$/)) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "โปรดระบุตำแหน่งของเพลงให้ถูกต้องด้วยนะคะ",
                        description: `เช่น \`${client.function.main.get_prefix(client, message)}seek 1:23\``,
                        color: 0x00ffff
                    })
                ]})
                const ms = args[0].split(":").map(Number).reduce((acc, curr) => curr + acc * 60) * 1000
                if (ms > player.queue.current.length) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: `ไม่สามารถข้ามไปยังนาทีที่ ${args[0]} ได้ค่ะ`,
                        description: `เพลงที่กำลังเล่นอยู่ขณะนี้ มีความยาว **${client.function.music.msToTime(player.queue.current.length)}**`,
                        color: 0x00ffff
                    })
                ]})
                player.seek(ms)
                message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ดำเนินการเรียบร้อยค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: `ข้ามไปยังนาทีที่ ${args[0]} เรียบร้อยค่ะ!`,
                        color: 0x00ffff
                    })
                ]})
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
    {
        name: "restart",
        category: "music",
        information: "เริ่มเล่นเพลงใหม่ตั้งแต่ต้น",
        async run(client, message) {
            try {
                const player = client.manager.players.get(message.guild.id)
                if (!player) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "ดูเหมือนตอนนี้บอทจะไม่ได้เชื่อมต่อช่องเสียงอยู่นะคะ",
                        color: 0x00ffff
                    })
                ]})
                const { channel } = message.member.voice
                if (player.channel != channel.id) return message.loading.edit({embeds:[
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
                ]})
                if (!player.queue.current) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "ไม่มีเพลงที่กำลังเล่นอยู่ในขณะนี้ค่ะ",
                        color: 0x00ffff
                    })
                ]})
                if (!player.queue.current.isSeekable) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "เพลงที่เล่นอยู่ขณะนี้ไม่สามารถกรอได้ค่ะ",
                        color: 0x00ffff
                    })
                ]})
                player.seek(0)
                message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ดำเนินการเรียบร้อยค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "เริ่มเล่นเพลงใหม่เรียบร้อยค่ะ",
                        color: 0x00ffff
                    })
                ]})
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
    {
        name: "skip",
        category: "music",
        information: "เล่นเพลงถัดไป",
        async run(client, message) {
            try {
                const player = client.manager.players.get(message.guild.id)
                if (!player) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "ดูเหมือนตอนนี้บอทจะไม่ได้เชื่อมต่อช่องเสียงอยู่นะคะ",
                        color: 0x00ffff
                    })
                ]})
                const { channel } = message.member.voice
                if (player.channel != channel.id) return message.loading.edit({embeds:[
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
                ]})
                if (!player.queue.current) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "ไม่มีเพลงที่กำลังเล่นอยู่ในขณะนี้ค่ะ",
                        color: 0x00ffff
                    })
                ]})
                if (player.queue.tracks.length < 1) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "ไม่มีเพลงในคิวให้ข้ามแล้วค่ะ",
                        color: 0x00ffff
                    })
                ]})
                player.queue.skip()
                message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ดำเนินการเรียบร้อยค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "กำลังเล่นเพลงถัดไปในคิวค่ะ",
                        color: 0x00ffff
                    })
                ]})
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
    {
        name: "skipto",
        category: "music",
        information: "ข้ามไปยังเพลง",
        async run(client, message, args) {
            try {
                const player = client.manager.players.get(message.guild.id)
                if (!player) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "ดูเหมือนตอนนี้บอทจะไม่ได้เชื่อมต่อช่องเสียงอยู่นะคะ",
                        color: 0x00ffff
                    })
                ]})
                const { channel } = message.member.voice
                if (player.channel != channel.id) return message.loading.edit({embeds:[
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
                ]})
                if (!player.queue.current) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "ไม่มีเพลงที่กำลังเล่นอยู่ในขณะนี้ค่ะ",
                        color: 0x00ffff
                    })
                ]})
                if (!args[0]) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "โปรดระบุแหน่งเพลงที่ต้องการจะให้ข้ามไปถึงด้วยนะคะ",
                        description: `เช่น \`${client.function.main.get_prefix(client, message)}skipto 5\``,
                        color: 0x00ffff
                    })
                ]})
                if (await player.queue.skipto(parseInt(args[0])) === "NO_QUEUE_CANNOT_SKIPTO") return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: `ไม่สามารถข้ามไปเล่นเพลงที่ \`${args[0]}\` ได้ค่ะ`,
                        description: `ดูเหมือนคิวเพลงจะตันถึงแค่เพลงที่ \`${player.queue.tracks.length}\` นะคะ`,
                        color: 0x00ffff
                    })
                ]})
                message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ดำเนินการเรียบร้อยค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "กำลังเล่นเพลงถัดไปในคิวค่ะ",
                        color: 0x00ffff
                    })
                ]})
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
    {
        name: "previous",
        aliases: ["prev"],
        category: "music",
        information: "เล่นเพลงก่อนหน้า",
        async run(client, message) {
            try {
                const player = client.manager.players.get(message.guild.id)
                if (!player) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "ดูเหมือนตอนนี้บอทจะไม่ได้เชื่อมต่อช่องเสียงอยู่นะคะ",
                        color: 0x00ffff
                    })
                ]})
                const { channel } = message.member.voice
                if (player.channel != channel.id) return message.loading.edit({embeds:[
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
                ]})
                player.queue.previou()
                message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ดำเนินการเรียบร้อยค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "กำลังเล่นเพลงก่อนหน้านี้ในคิวค่ะ",
                        color: 0x00ffff
                    })
                ]})
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
    {
        name: "move",
        aliases: ["mv"],
        category: "music",
        information: "ย้ายเพลงในคิว",
        async run(client, message) {
            try {
                const player = client.manager.players.get(message.guild.id)
                if (!player) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "ดูเหมือนตอนนี้บอทจะไม่ได้เชื่อมต่อช่องเสียงอยู่นะคะ",
                        color: 0x00ffff
                    })
                ]})
                const { channel } = message.member.voice
                if (player.channel != channel.id) return message.loading.edit({embeds:[
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
                ]})
                if (!player.queue.current) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "ไม่มีเพลงที่กำลังเล่นอยู่ในขณะนี้ค่ะ",
                        color: 0x00ffff
                    })
                ]})
                if (!args[0] || !args[1]) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "โปรดเพลงที่ต้องการจะให้ย้ายให้ถูกต้องด้วยนะคะ",
                        description: `เช่น \`${client.function.main.get_prefix(client, message)}move 3 1\``,
                        color: 0x00ffff
                    })
                ]})
                if (player.queue.move(args[0], args[1]) === "NO_QUEUE_CANNOT_MOVE") return

            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
    {
        name: "playskip",
        aliases: ["ps"],
        category: "music",
        information: "เล่นเพลงทันที",
        async run(client, message, args) {
            try {
                const { channel } = message.member.voice
                if (!channel) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "ไม่พบช่องเสียงที่คุณอยู่ค่ะ",
                        color: 0x00ffff
                    })
                ]})
                let player = client.manager.players.get(message.guild.id)
                if (!player) {
                    player = await client.manager.create(message.guild.id)
                    await player.connect(channel.id, { selfDeaf: true })
                    client.function.music.player_events(client, message, player)
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
                    ]}).then(m => setTimeout(() => m.delete(), 5000))
                } else {
                    if (player.channel != channel.id) {
                        const player_channel = message.guild.channels.cache.get(player.channel)
                        if (player.playing && player_channel.members.size > 1) {
                            return message.loading.edit({embeds:[
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
                            ]})
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
                                }).then(m => setTimeout(() => m.delete(), 5000))
                            ]})
                        }
                    }
                }
                if (!args[0]) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "โปรดระบุเพลงที่ต้องการจะให้เล่นด้วยนะคะ",
                        color: 0x00ffff
                    })
                ]})
                const res = await client.function.music.getTracks(client, args.join(" "))
                if (res === "ERROR_MUSIC_NOT_FOUND_OK_NAJA") return message.loading.edit({embeds:[
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
                ]})
                player.queue.add(res, message.author)
                if (!player.playing) player.queue.start()
                if (res.length === 1) {
                    player.queue.move(player.queue.tracks.length, 1)
                    player.queue.skip()
                    return message.loading.edit({embeds:[
                        new MessageEmbed({
                            author: {
                                icon_url: client.user.avatarURL(),
                                name: "ดำเนินการเรียบร้อยค่ะ!",
                                url: client.config.embed_author_url
                            },
                            title: res[0].info.title,
                            url: res[0].info.uri,
                            description: "ข้ามและเล่นเพลงใหม่เรียบร้อยค่ะ",
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
                    ]})
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
                        description: `ข้ามและเล่นเพลงใหม่ทั้งหมด ${res.length} เพลงเรียบร้อยค่ะ!`,
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

                for (let i = 0; i < player.queue.tracks.length; i++) player.queue.move(player.queue.tracks.length - i, i + 1)

                const canFitOnOnePage = res.length <= 10
                const embedMessage = await message.loading.edit({
                    embeds: [generateEmbed(0)],
                    components: canFitOnOnePage
                        ? []
                        : [new MessageActionRow({components: [forwardButton]})]
                    })
    
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
                client.function.main.error_log(e, client, message)
            }
        }
    },
    {
        name: "shuffle",
        aliases: ["sf"],
        category: "music",
        information: "สุ่มเพลงในคิว",
        async run(client, message) {
            try {
                const player = client.manager.players.get(message.guild.id)
                if (!player) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "ดูเหมือนตอนนี้บอทจะไม่ได้เชื่อมต่อช่องเสียงอยู่นะคะ",
                        color: 0x00ffff
                    })
                ]})
                const { channel } = message.member.voice
                if (player.channel != channel.id) return message.loading.edit({embeds:[
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
                ]})
                player.queue.shuffle()
                message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ดำเนินการเรียบร้อยค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "สุ่มเพลงในคิวเรียบร้อยค่ะ",
                        description: `\`${client.function.main.get_prefix(client, message)}queue\` เพื่อดูการเปลี่ยนแปลงได้เลยค่ะ`,
                        color: 0x00ffff
                    })
                ]})
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
    {
        name: "leave",
        aliases: ["stop","dis","disconnect"],
        category: "music",
        information: "หยุดเล่นเพลง และออกจากห้องเสียง",
        async run(client, message) {
            try {
                const player = client.manager.players.get(message.guild.id)
                if (!player) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "ดูเหมือนตอนนี้บอทจะไม่ได้เชื่อมต่อช่องเสียงอยู่นะคะ",
                        color: 0x00ffff
                    })
                ]})
                const { channel } = message.member.voice
                if (player.channel != channel.id) return message.loading.edit({embeds:[
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
                ]})
                client.manager.destroy(message.guild.id)
                message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ดำเนินการเรียบร้อยค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: `ตัดการเชื่อมต่อจากช่องเสียง \`${channel.name}\` เรียบร้อยค่ะ!`,
                        color: 0x00ffff
                    })
                ]})
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
    {
        name: "autoplay",
        aliases: ["ap"],
        category: "music",
        information: "เล่นเพลงอัตโนมัติไปเรื่อยๆ",
        async run(client, message) {
            try {
                const player = client.manager.players.get(message.guild.id)
                if (!player) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "ดูเหมือนตอนนี้บอทจะไม่ได้เชื่อมต่อช่องเสียงอยู่นะคะ",
                        color: 0x00ffff
                    })
                ]})
                const { channel } = message.member.voice
                if (player.channel != channel.id) return message.loading.edit({embeds:[
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
                ]})
                if (player.autoplay) {
                    player.autoplay = false
                    return message.loading.edit({embeds:[
                        new MessageEmbed({
                            author: {
                                icon_url: client.user.avatarURL(),
                                name: "ดำเนินการเรียบร้อยค่ะ!",
                                url: client.config.embed_author_url
                            },
                            title: "ปิดโหมด Autoplay เรียบร้อยค่ะ",
                            color: 0x00ffff
                        })
                    ]})
                }
                player.autoplay = true
                message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ดำเนินการเรียบร้อยค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "เปิดโหมด Autoplay เรียบร้อยค่ะ",
                        color: 0x00ffff
                    })
                ]})
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
    {
        name: "setup",
        category: "music",
        information: "ตั้งค่าห้องสั่งเพลงบอทของดิส",
        async run(client, message) {
            try {
                async function create_channel_and_msg() {
                    const channel = await message.guild.channels.create(`🎶 ${client.user.username}`, {
                        type: "GUILD_TEXT",
                        parent: message.channel.parentId
                    })
                    const msg = await channel.send(client.utils.player_msg_default(client))
                    return { channel: channel, msg: msg }
                }

                let player
                const this_guild_settings = await client.function.database.get_this_guild_settings(client, message.guild.id)
                if (this_guild_settings !== null) {
                    if (this_guild_settings.music_player === null) {
                        player = await create_channel_and_msg()
                        client.mysql.query(`UPDATE \`guilds\` SET \`music_player\` = '${JSON.stringify({ channel_id: player.channel.id, message_id: player.msg.id })}' WHERE \`guild_id\` = '${message.guild.id}'`, (err, res) => { if (err) console.log(err) })
                    } else {
                        try { message.guild.channels.cache.get(JSON.parse(this_guild_settings.music_player).channel_id).delete() } catch (e) { console.log(e) }
                        client.mysql.query(`UPDATE \`guilds\` SET \`music_player\` = NULL WHERE \`guild_id\` = '${message.guild.id}'`, (err, res) => { if (err) console.log(err) })
                        return message.loading.edit({embeds:[
                            new MessageEmbed({
                                author: {
                                    icon_url: client.user.avatarURL(),
                                    name: "ดำเนินการเรียบร้อยค่ะ!",
                                    url: client.config.embed_author_url
                                },
                                title: "ลบห้องสั่งเพลงของบอทเรียบร้อยค่ะ",
                                description: "สามารถสร้างใหม่โดยใช้คำสั่งนี้อีกครั้งได้เลยค่ะ",
                                color: 0x00ffff
                            })
                        ]})
                    }
                } else {
                    player = await create_channel_and_msg()
                    client.mysql.query(
                        "INSERT INTO `guilds` (id, guild_id, custom_prefix, blacklist, premium, ranking_exp, welcome_channel_id, auto_voice_channel_id, music_player, reactions_roles) " +
                        `VALUES (NULL, ${message.guild.id}, NULL, NULL, NULL, NULL, NULL, NULL, '${JSON.stringify({ channel_id: player.channel.id, message_id: player.msg.id })}', NULL)`, (err, ins) => { if (err) console.log(err) })
                }
                message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ดำเนินการเรียบร้อยค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "ตั้งค่าห้องสั่งเพลงของบอทเรียบร้อยค่ะ",
                        description: `<#${player.channel.id}> | สามารถลบโดยใช้คำสั่งนี้อีกครั้งได้เลยค่ะ`,
                        color: 0x00ffff
                    })
                ]})
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
    {
        name: "rtest",
        async run(client, message) {
            try {
                let count = 0
                setInterval(() => {
                    count++
                    message.channel.send(`rate limit test | ${count}`)
                }, 3000)
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    }
]

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}