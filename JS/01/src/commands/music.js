const { MessageEmbed , MessageButton , MessageActionRow} = require('discord.js')
const config = require("../../config")
const { error_log, get_prefix } = require("../functions/main")
const music = require("../functions/music")

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
                            url: config.embed_author_url
                        },
                        title: "ไม่พบช่องเสียงที่คุณอยู่ค่ะ",
                        color: 0x00ffff
                    })
                ]})
                let player = client.manager.players.get(message.guild.id)
                if (!player) {
                    player = await client.manager.create(message.guild.id)
                    await player.connect(channel.id, { selfDeaf: true })
                    music.player_events(client, message, player)
                    return message.loading.edit({embeds:[
                        new MessageEmbed({
                            author: {
                                icon_url: client.user.avatarURL(),
                                name: "ดำเนินการเรียบร้อยค่ะ!",
                                url: config.embed_author_url
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
                                    url: config.embed_author_url
                                },
                                title: "ดูเหมือนตอนนี้บอทจะไม่ได้เชื่อมต่อช่องเสียงของคุณอยู่นะคะ",
                                description: `ขณะนี้มีคนใช้บอทอยู่ที่ช่องเสียง <#${player.channel}> ค่ะ`,
                                color: 0x00ffff
                            })
                        ]})
                    } else {
                        await player.connect(channel.id, { selfDeaf: true })
                        message.loading.edit({embeds:[
                            new MessageEmbed({
                                author: {
                                    icon_url: client.user.avatarURL(),
                                    name: "ดำเนินการเรียบร้อยค่ะ!",
                                    url: config.embed_author_url
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
                                url: config.embed_author_url
                            },
                            title: `เชื่อมต่อช่องเสียงที่คุณอยู่ อยู่แล้วค่ะ`,
                            color: 0x00ffff
                        })
                    ]})
                }
            } catch (e) {
                error_log(e, client, message)
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
                            url: config.embed_author_url
                        },
                        title: "ไม่พบช่องเสียงที่คุณอยู่ค่ะ",
                        color: 0x00ffff
                    })
                ]})
                let player = client.manager.players.get(message.guild.id)
                if (!player) {
                    player = await client.manager.create(message.guild.id)
                    await player.connect(channel.id, { selfDeaf: true })
                    music.player_events(client, message, player)
                    message.channel.send({embeds:[
                        new MessageEmbed({
                            author: {
                                icon_url: client.user.avatarURL(),
                                name: "ดำเนินการเรียบร้อยค่ะ!",
                                url: config.embed_author_url
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
                                        url: config.embed_author_url
                                    },
                                    title: "ดูเหมือนตอนนี้บอทจะไม่ได้เชื่อมต่อช่องเสียงของคุณอยู่นะคะ",
                                    description: `ขณะนี้มีคนใช้บอทอยู่ที่ช่องเสียง <#${player.channel}> ค่ะ`,
                                    color: 0x00ffff
                                })
                            ]})
                        } else {
                            await player.connect(channel.id, { selfDeaf: true })
                            message.channel.send({embeds:[
                                new MessageEmbed({
                                    author: {
                                        icon_url: client.user.avatarURL(),
                                        name: "ดำเนินการเรียบร้อยค่ะ!",
                                        url: config.embed_author_url
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
                            url: config.embed_author_url
                        },
                        title: "โปรดระบุเพลงที่ต้องการจะให้เล่นด้วยนะคะ",
                        color: 0x00ffff
                    })
                ]})
                const res = await music.getTracks(client.manager, player, args.join(" "))
                if (res === "ERROR_MUSIC_NOT_FOUND_OK_NAJA") return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: config.embed_author_url
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
                                url: config.embed_author_url
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
                                    value: `\`${res[0].info.isStream ? "STREAM" : music.msToTime(res[0].info.length)}\``,
                                    inline: true
                                },
                                {
                                    name: "ขอเพลงโดย",
                                    value: `<@!${message.author.id}>`,
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
                            url: config.embed_author_url
                        },
                        title: "Platlist",
                        url: args.join(" "),
                        description: `เพิ่มเพลงจากเพลย์ลิสต์ทั้งหมด ${res.length} เพลง ไปยังคิวเรียบร้อยค่ะ!`,
                        thumbnail: {
                            url: `https://img.youtube.com/vi/${current[0].info.identifier}/mqdefault.jpg`
                        },
                        fields: current.map(s => ({
                            name:`${res.indexOf(s) + 1}) ${s.info.title}`,
                            value:`*${s.info.isStream ? "STREAM" : music.msToTime(s.info.length)}* | ${s.info.author}`
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
                error_log(e, client, message)
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
                            url: config.embed_author_url
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
                            url: config.embed_author_url
                        },
                        title: "ดูเหมือนตอนนี้บอทจะไม่ได้เชื่อมต่อช่องเสียงของคุณอยู่นะคะ",
                        description: `ขณะนี้มีคนใช้บอทอยู่ที่ช่องเสียง <#${player.channel}> ค่ะ`,
                        color: 0x00ffff
                    })
                ]})
                if (player.paused) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: config.embed_author_url
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
                            url: config.embed_author_url
                        },
                        title: "พักการเล่นเพลงเรียบร้อยค่ะ",
                        description: `เพลงที่กำลังเล่นขณะนี้ **${player.queue.current.title}**`,
                        thumbnail: {
                            url: `https://img.youtube.com/vi/${player.queue.current.identifier}/mqdefault.jpg`
                        },
                        fields: [
                            {
                                name: `${music.msToTime(player.queue.current.position)} / ${music.msToTime(player.queue.current.length)}`,
                                value: `${music.progressbar(player.queue.current.length, player.queue.current.position, 15)}`,
                                inline: true
                            },
                            {
                                name: 'ขอเพลงโดย',
                                value: `<@!${player.queue.current.requester}>`,
                                inline: true
                            }
                        ],
                        color: 0x00ffff
                    })
                ]})
            } catch (e) {
                error_log(e, client, message)
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
                            url: config.embed_author_url
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
                            url: config.embed_author_url
                        },
                        title: "ดูเหมือนตอนนี้บอทจะไม่ได้เชื่อมต่อช่องเสียงของคุณอยู่นะคะ",
                        description: `ขณะนี้มีคนใช้บอทอยู่ที่ช่องเสียง <#${player.channel}> ค่ะ`,
                        color: 0x00ffff
                    })
                ]})
                if (!player.paused && player.playing) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: config.embed_author_url
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
                            url: config.embed_author_url
                        },
                        title: "เล่นเพลงต่อเรียบร้อยค่ะ",
                        description: `เพลงที่กำลังเล่นขณะนี้ **${player.queue.current.title}**`,
                        thumbnail: {
                            url: `https://img.youtube.com/vi/${player.queue.current.identifier}/mqdefault.jpg`
                        },
                        fields: [
                            {
                                name: `${music.msToTime(player.queue.current.position)} / ${music.msToTime(player.queue.current.length)}`,
                                value: `${music.progressbar(player.queue.current.length, player.queue.current.position, 15)}`,
                                inline: true
                            },
                            {
                                name: 'ขอเพลงโดย',
                                value: `<@!${player.queue.current.requester}>`,
                                inline: true
                            }
                        ],
                        color: 0x00ffff
                    })
                ]})
            } catch (e) {
                error_log(e, client, message)
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
                            url: config.embed_author_url
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
                                url: config.embed_author_url
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
                                url: config.embed_author_url
                            },
                            title: "ขณะนี้ไม่มีเพลงในคิวแล้วค่ะ",
                            fields: [
                                {
                                    name:
                                        `ขณะนี้กำลังเล่นเพลง\n` +
                                        `${music.msToTime(player.queue.current.position)} / ${music.msToTime(player.queue.current.length)}\n` +
                                        `${music.progressbar(player.queue.current.length, player.queue.current.position, 28)}\n` +
                                        `${player.queue.current.title}`,
                                    value: `*${music.msToTime(player.queue.current.length)}* | ${player.queue.current.author} | ขอเพลงโดย <@!${player.queue.current.requester}>`
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
                            url: config.embed_author_url
                        },
                        title: `มีเพลงในคิวทั้งหมด ${player.queue.tracks.length} เพลง`,
                        description: `นี่คือเพลงที่ ${start + 1} ถึงเพลงที่ ${start + current.length}`,
                        fields: [
                            current.map(s => ({
                                name:`${player.queue.tracks.indexOf(s) + 1}) ${s.title}`,
                                value:`*${music.msToTime(s.length)}* | ${s.author} | ขอเพลงโดย <@!${s.requester}>`
                            })),
                            {
                                name:
                                    `ขณะนี้กำลังเล่นเพลง\n` +
                                    `${music.msToTime(player.queue.current.position)} / ${music.msToTime(player.queue.current.length)}\n` +
                                    `${music.progressbar(player.queue.current.length, player.queue.current.position, 28)}\n` +
                                    `${player.queue.current.title}`,
                                value: `*${music.msToTime(player.queue.current.length)}* | ${player.queue.current.author} | ขอเพลงโดย <@!${player.queue.current.requester}>`
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
                error_log(e, client, message)
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
                            url: config.embed_author_url
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
                            url: config.embed_author_url
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
                            url: config.embed_author_url
                        },
                        title: player.queue.current.title,
                        url: player.queue.current.uri,
                        fields: [
                            {
                                name: `${music.msToTime(player.queue.current.position)} / ${music.msToTime(player.queue.current.length)}`,
                                value: `${music.progressbar(player.queue.current.length, player.queue.current.position, 28)}`,
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
                        color: 0x00ffff
                    })
                ]})
            } catch (e) {
                error_log(e, client, message)
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
                            url: config.embed_author_url
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
                            url: config.embed_author_url
                        },
                        title: "ดูเหมือนตอนนี้บอทจะไม่ได้เชื่อมต่อช่องเสียงของคุณอยู่นะคะ",
                        description: `ขณะนี้มีคนใช้บอทอยู่ที่ช่องเสียง <#${player.channel}> ค่ะ`,
                        color: 0x00ffff
                    })
                ]})
                if (!args[0]) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: config.embed_author_url
                        },
                        title: "โปรดระบุระดับเสียงที่ต้องการปรับด้วยนะคะ",
                        description: `เช่น \`${get_prefix(client, message)}vol 38\``,
                        color: 0x00ffff
                    })
                ]})
                if (!args[0].match(/([0-9]{1,2})[:ms](([0-9]{1,2})s?)?/g)) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: config.embed_author_url
                        },
                        title: "โปรดระบุระดับเสียงที่ต้องการปรับให้ถูกต้องด้วยนะคะ",
                        description: `เช่น \`${get_prefix(client, message)}vol 38\``,
                        color: 0x00ffff
                    })
                ]})
                if (parseInt(args[0]) > 150 || parseInt(args[0]) < 1) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: config.embed_author_url
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
                            url: config.embed_author_url
                        },
                        title: `ปรับระดับเสียง จาก \`${volume_before}\` ไปที่ \`${args[0]}\` เรียบร้อยค่ะ`
                    })
                ]})
            } catch (e) {
                error_log(e, client, message)
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
                            url: config.embed_author_url
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
                            url: config.embed_author_url
                        },
                        title: "ดูเหมือนตอนนี้บอทจะไม่ได้เชื่อมต่อช่องเสียงของคุณอยู่นะคะ",
                        description: `ขณะนี้มีคนใช้บอทอยู่ที่ช่องเสียง <#${player.channel}> ค่ะ`,
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
                                    url: config.embed_author_url
                                },
                                title: "รีเซ็ตการตั้งค่า equalizer เรียบร้อยค่ะ",
                                color: 0x00ffff
                            })
                        ]})
                    }
                    player.nightcore = true
                    message.loading.edit({embeds:[
                        new MessageEmbed({
                            author: {
                                icon_url: client.user.avatarURL(),
                                name: "ดำเนินการเรียบร้อยค่ะ!",
                                url: config.embed_author_url
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
                                    url: config.embed_author_url
                                },
                                title: "รีเซ็ตการตั้งค่า equalizer เรียบร้อยค่ะ",
                                color: 0x00ffff
                            })
                        ]})
                    }
                    player.vaporwave = true
                    message.loading.edit({embeds:[
                        new MessageEmbed({
                            author: {
                                icon_url: client.user.avatarURL(),
                                name: "ดำเนินการเรียบร้อยค่ะ!",
                                url: config.embed_author_url
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
                            url: config.embed_author_url
                        },
                        title: "รีเซ็ตการตั้งค่า equalizer เรียบร้อยค่ะ",
                        color: 0x00ffff
                    })
                ]})
            } catch (e) {
                error_log(e, client, message)
            }
        }
    },
    {
        name: "loop",
        aliases: ["repeat"],
        category: "music",
        information: "เปิดการเล่นซ้ำ",
        async run(client, message) {
            try {

            } catch (e) {
                error_log(e, client, message)
            }
        }
    },
    {
        name: "skip",
        category: "music",
        information: "เล่นเพลงถัดไป",
        async run(client, message) {
            try {

            } catch (e) {
                error_log(e, client, message)
            }
        }
    },
    {
        name: "skipto",
        category: "music",
        information: "ข้ามไปยังเพลง",
        async run(client, message) {
            try {

            } catch (e) {
                error_log(e, client, message)
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

            } catch (e) {
                error_log(e, client, message)
            }
        }
    },
    {
        name: "playskip",
        aliases: ["ps"],
        category: "music",
        information: "เล่นเพลงทันที",
        async run(client, message) {
            try {

            } catch (e) {
                error_log(e, client, message)
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

            } catch (e) {
                error_log(e, client, message)
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

            } catch (e) {
                error_log(e, client, message)
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

            } catch (e) {
                error_log(e, client, message)
            }
        }
    },
    {
        name: "setup",
        category: "music",
        information: "ตั้งค่าห้องสั่งเพลงของดิส",
        async run(client, message) {
            try {

            } catch (e) {
                error_log(e, client, message)
            }
        }
    }
]

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}