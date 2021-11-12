const { MessageEmbed, MessageActionRow } = require('discord.js')
const os = require('os')
const osu = require('node-os-utils')

module.exports = [
    {
        name: "ping",
        category: "developer",
        information: "ตรวจสอบความหน่วงของบอท",
        async run(client, message) {
            try {
                message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: `ปิงของบอทตอนนี้ อยู่ที่ ${client.ws.ping}ms ค่ะ!`,
                            url: client.config.embed_author_url
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
        name: "stats",
        category: "developer",
        information: "ดูข้อมูลต่างๆ ของตัวบอท",
        async run(client, message) {
            try {
                const guilds = [].concat.apply([], await client.cluster.broadcastEval(client => client.guilds.cache))
                const clusters = await client.cluster.broadcastEval(client => ({
                    ping: client.ws.ping,
                    cpu: (process.cpuUsage().user + process.cpuUsage().system) / Object.values(require('os').cpus()[0].times).reduce((acc, tv) => acc + tv, 0),
                    ram: process.memoryUsage().heapUsed / 1024 / 1024
                }))
                const self_db = await client.function.api.db_ping(client, 0)
                const core_db = await client.function.api.db_ping(client, 1)
                const api_stats = await client.function.api.stats(client)
                message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: `Bot Stats | นี่คือข้อมูลของตัวบอทค่ะ!`,
                            url: client.config.embed_author_url
                        },
                        fields: [
                            {
                                name: "Servers count",
                                value: guilds.length.toLocaleString() + " servers",
                                inline: true
                            },
                            {
                                name: "Members count",
                                value: guilds.map(g => g.memberCount).reduce((a, b) => a + b).toLocaleString() + " members",
                                inline: true
                            },
                            {
                                name: "Channels count",
                                value: guilds.map(g => g.channels.length).reduce((a, b) => a + b).toLocaleString() + " channels",
                                inline: true
                            },
                            {
                                name: "CPU Usage",
                                value: (clusters.map(d => d.cpu).reduce((a, b) => a + b)).toFixed(2) + "%",
                                inline: true
                            },
                            {
                                name: "Memory Usage",
                                value: (clusters.map(d => d.ram).reduce((a, b) => a + b) / clusters.length).toFixed(2) + " MB",
                                inline: true
                            },
                            {
                                name: "Database Usage",
                                value: `${self_db.size.toLocaleString()} MB / ${core_db.size.toLocaleString()} MB`,
                                inline: true
                            },
                            {
                                name: "Server Info",
                                value: "```" +
                                    `CPU Info : ${os.cpus()[0].model}` + "\n" +
                                    `CPU Usage : ${await osu.cpu.usage()}%` + "\n" +
                                    await osu.mem.info().then(info => `Memory Usage : ${info.usedMemPercentage}% (${info.usedMemMb.toLocaleString()} MB)`) + "\n" +
                                    "```"
                            },
                            {
                                name: "API Stats",
                                value: "```" +
                                    `Process CPU Usage : ${api_stats.data.process_cpu}` + "\n" +
                                    `Process Memory Usage : ${api_stats.data.process_ram}` + "\n" +
                                    `CPU Info : ${api_stats.data.cpu_info}` + "\n" +
                                    `CPU Usage : ${api_stats.data.cpu_usage}` + "\n" +
                                    `Memory Usage : ${api_stats.data.ram_usage}` + "\n" +
                                    "```"
                            }
                        ],
                        footer: {
                            text:
                                `Client : ${(clusters.map(d => d.ping).reduce((a, b) => a + b) / clusters.length).toFixed(0).toLocaleString()}ms | ` +
                                `Database : ${self_db.ping.toLocaleString()}ms / ${core_db.ping.toLocaleString()}ms | ` +
                                `API : ${api_stats.ms.toLocaleString()}ms | ` +
                                `Node.js ${process.version}`
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
        name: "shard",
        category: "developer",
        information: "ดูข้อมูล Shards ของตัวบอท",
        async run(client, message) {
            try {
                const clusters = await client.cluster.broadcastEval(client => ({
                    server: client.guilds.cache.size,
                    member: client.guilds.cache.map(g => g.memberCount).reduce((a, b) => a + b),
                    channel: client.channels.cache.size,
                    ping: client.ws.ping,
                    cpu: (process.cpuUsage().user + process.cpuUsage().system) / Object.values(require('os').cpus()[0].times).reduce((acc, tv) => acc + tv, 0),
                    ram: process.memoryUsage().heapUsed / 1024 / 1024
                }))
                function generateEmbed(index) {
                    const current = clusters[index]
                    return new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: `นี่คือข้อมูลของ Shard ที่ ${index} ค่ะ!`,
                            url: client.config.embed_author_url
                        },
                        fields: [
                            {
                                name: "Servers count",
                                value: current.server.toLocaleString() + " servers",
                                inline: true,
                            },
                            {
                                name: "Members count",
                                value: current.member.toLocaleString() + " members",
                                inline: true,
                            },
                            {
                                name: "Channels count",
                                value: current.channel.toLocaleString() + " channels",
                                inline: true,
                            },
                            {
                                name: "Ping",
                                value: current.ping.toFixed(0) + "ms",
                                inline: true,
                            },
                            {
                                name: "CPU Usage",
                                value: current.cpu.toFixed(2) + "%",
                                inline: true,
                            },
                            {
                                name: "Memory Usage",
                                value: current.ram.toFixed(2) + " MB",
                                inline: true,
                            },
                        ],
                        color: 0x00ffff
                    })
                }

                const canFitOnOnePage = clusters.length <= 1

                message.loading.edit({
                    embeds: [generateEmbed(0)],
                    components: canFitOnOnePage ? [] : [new MessageActionRow({components: [client.utils.button().forward]})]
                })

                if (canFitOnOnePage) return

                let currentIndex = 0
                message.loading.createMessageComponentCollector({
                    filter: ({user}) => user.id === message.author.id, time: 30 * 60000
                }).on("collect", interaction => {
                    interaction.customId === 'back' ? (currentIndex -= 1) : (currentIndex += 1)
                    interaction.update({
                        embeds: [generateEmbed(currentIndex)],
                        components: [
                            new MessageActionRow({
                                components: [
                                ...(currentIndex ? [client.utils.button().back] : []),
                                ...(currentIndex + 1 < clusters.length ? [client.utils.button().forward] : [])
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
        name: "node",
        category: "developer",
        information: "ดูข้อมูล Node เล่นเพลงทั้งหมดของตัวบอท",
        async run(client, message) {
            try {
                const nodes = [...client.manager.sockets]

                function generateEmbed(index) {
                    const current = nodes[index][1]

                    return new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: `นี่คือข้อมูลของ Node เล่นเพลง [${current.id}] ค่ะ!`,
                            url: client.config.embed_author_url
                        },
                        title: "Status => " + current.connected ? "Online" : "Offline",
                        fields: [
                            {
                                name: "Players",
                                value: current.stats.players.toLocaleString() + " players",
                                inline: true
                            },
                            {
                                name: "Playing players",
                                value: current.stats.playingPlayers.toLocaleString() + " players",
                                inline: true
                            },
                            {
                                name: "Uptime",
                                value: client.function.music.msToTime(current.stats.uptime),
                                inline: true
                            },
                            {
                                name: "CPU Usage",
                                value: current.stats.cpu.lavalinkLoad.toFixed(2),
                                inline: true
                            },
                            {
                                name: "Memory Usage",
                                value: (current.stats.memory.used / 1024 / 1024).toFixed(2) + " MB",
                                inline: true
                            }
                        ],
                        footer: {
                            text: nodes.length > 1 ? `นี่คือ Node ที่ ${start + 1} จากทั้งหมด ${nodes.length} Node ค่ะ` : ""
                        },
                        color: 0x00ffff
                    })
                }

                const canFitOnOnePage = nodes.length <= 1

                message.loading.edit({
                    embeds: [generateEmbed(0)],
                    components: canFitOnOnePage ? [] : [new MessageActionRow({components: [client.utils.button().forward]})]
                })

                if (canFitOnOnePage) return

                let currentIndex = 0
                message.loading.createMessageComponentCollector({
                    filter: ({user}) => user.id === message.author.id, time: 30 * 60000
                }).on("collect", interaction => {
                    interaction.customId === 'back' ? (currentIndex -= 1) : (currentIndex += 1)
                    interaction.update({
                        embeds: [generateEmbed(currentIndex)],
                        components: [
                            new MessageActionRow({
                                components: [
                                ...(currentIndex ? [client.utils.button().back] : []),
                                ...(currentIndex + 1 < nodes.length ? [client.utils.button().forward] : [])
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
        name: "menuadd",
        category: "developer",
        information: "เพิ่มเมนูลงในคลังเมนู",
        async run(client, message, args) {
            try {
                if (!args[0]) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "คุณต้องระบุเมนูที่ต้องการจะเพิ่มลงในคลังด้วยนะคะ",
                        color: 0x00ffff
                    })
                ]})
                const pics = await client.function.api.getimgurls(client, args.join(" "), 5)
                client.datacore.query(`INSERT INTO \`food\` (id, menu, pic) VALUES (NULL, '${args.join(" ")}', '${JSON.stringify(pics.data)}')`, (err, ins) => { if (err) throw err })
                message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ดำเนินการเรียบร้อยค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: `เพิ่ม "${args.join(" ")}" ลงในคลังเมนูเรียบร้อยค่ะ!`,
                        image: {
                            url: client.function.main.random_choice(pics.data).url
                        },
                        footer: {
                            text: "API response : " + pics.ms.toLocaleString() + " ms"
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
        name: "menulist",
        category: "developer",
        information: "ดูรายการเมนูทั้งหมดในคลังเมนู",
        async run(client, message, args) {
            try {
                const menus = await client.function.api.core_menulist(client)

                if (menus.length < 1) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ขณะนี้ยังไม่มีเมนูในคลังเลยค่ะ",
                            url: client.config.embed_author_url
                        },
                        title: "สามารถเพิ่มเมนูลงในคลังได้",
                        description: `โดยใช้คำสั่ง ${client.function.main.get_prefix(client, message)} ได้เลยค่ะ!`,
                        color: 0x00ffff
                    })
                ]})

                function generateEmbed(start) {
                    const current = menus.slice(start, start + 10)

                    return new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "นี่คือเมนูทั้งหมดในคลังเมนูค่ะ",
                            url: client.config.embed_author_url
                        },
                        title: `มีเมนูอาหารทั้งหมด ${menus.length} เมนู`,
                        description: "```" + current.map(m => `${menus.indexOf(m) + 1}) ${m.menu}`).join("\n") + "```",
                        footer: {
                            text: menus.length > 10 ? `นี่คือหน้าที่ ${(start / 10) + 1} จากทั้งหมด ${Math.ceil(menus.length / 10)} หน้าค่ะ` : ""
                        },
                        color: 0x00ffff
                    })
                }

                const canFitOnOnePage = menus.length <= 10

                message.loading.edit({
                    embeds: [generateEmbed(0)],
                    components: canFitOnOnePage ? [] : [new MessageActionRow({components: [client.utils.button().forward]})]
                })

                if (canFitOnOnePage) return

                let currentIndex = 0
                message.loading.createMessageComponentCollector({
                    filter: ({user}) => user.id === message.author.id, time: 30 * 60000
                }).on("collect", interaction => {
                    interaction.customId === 'back' ? (currentIndex -= 10) : (currentIndex += 10)
                    interaction.update({
                        embeds: [generateEmbed(currentIndex)],
                        components: [
                            new MessageActionRow({
                                components: [
                                ...(currentIndex ? [client.utils.button().back] : []),
                                ...(currentIndex + 10 < menus.length ? [client.utils.button().forward] : [])
                                ]
                            })
                        ]
                    })
                })
            } catch (e) {
                client.function.main.error_log(e, client, message)
            } 
        }
    }
]