const { MessageEmbed , MessageButton, MessageActionRow } = require('discord.js')
const { readdirSync } = require('fs')

module.exports = [
    {
        name: "help",
        aliases: ["h"],
        category: "basic",
        information: "หน้าช่วยเหลือของบอท",
        async run(client, message) {
            try {
                const homeButton = new MessageButton({
                    style: 'SUCCESS',
                    emoji: "⚓",
                    label: "หน้าหลัก",
                    customId: "home"
                })
                const basicButton = new MessageButton({
                    style: 'SECONDARY',
                    emoji: "🏠",
                    label: "ทั่วไป",
                    customId: "basic"
                })
                const musicButton = new MessageButton({
                    style: 'SECONDARY',
                    emoji: "🎵",
                    label: "เพลง",
                    customId: "music"
                })
                const gameButton = new MessageButton({
                    style: 'SECONDARY',
                    emoji: "🎮",
                    label: "เกม",
                    customId: "game"
                })
                const rateButton = new MessageButton({
                    style: 'SECONDARY',
                    emoji: "🔞",
                    label: "18+",
                    customId: "rate"
                })
                const guild_settingsButton = new MessageButton({
                    style: 'SECONDARY',
                    emoji: "⚙️",
                    label: "ตั้งค่า",
                    customId: "guild_settings"
                })
                const developerButton = new MessageButton({
                    style: 'SECONDARY',
                    emoji: "🧑‍💻",
                    label: "ผู้พัฒนา",
                    customId: "developer"
                })
                const guild_adminButton = new MessageButton({
                    style: 'SECONDARY',
                    emoji: "🔒",
                    label: "แอดมินดิส",
                    customId: "guild_admin"
                })
                const bot_adminButton = new MessageButton({
                    style: 'SECONDARY',
                    emoji: "⚓",
                    label: "แอดมินบอท",
                    customId: "bot_admin"
                })

                const components1 = new MessageActionRow({components: [homeButton, basicButton, musicButton, gameButton]})
                const components2 = new MessageActionRow({components: [rateButton, guild_settingsButton, developerButton, guild_adminButton]})
                if (client.function.main.isAdmin(client, message.author.id)) components2.components.push(bot_adminButton)

                const mainEmbed = new MessageEmbed({
                    author: {
                        icon_url: client.user.avatarURL(),
                        name: "สวัสดีค่ะ! มีอะไรให้ช่วยไหมคะ?",
                        url: client.config.embed_author_url
                    },
                    title: "สามารถดูคำสั่งทั้งหมดได้ที่เมนูด้านล่างเลยค่ะ",
                    image: {
                        url: client.config.help_image
                    },
                    color: 0x00ffff
                })

                async function generateEmbed(category) {
                    let word = client.user.username
                    if (category === "basic") word = "นี่คือคำสั่งทั่วไปของบอทค่ะ!"
                    if (category === "music") word = "นี่คือคำสั่งในหมวดหมู่เพลงของบอทค่ะ"
                    if (category === "game") word = "นี่คือคำสั่งในหมวดหมู่เกมค่ะ"
                    if (category === "guild_settings") word = "นี่คือคำสั่งในหมวดหมู่เซิร์ฟเวอร์ค่ะ"
                    if (category === "developer") word = "นี่คือคำสั่งในหมวดหมู่ผู้พัฒนาค่ะ"
                    if (category === "guild_admin") word = "นี่คือคำสั่งในหมวดหมู่แอดมินเซิร์ฟเวอร์ค่ะ"
                    if (category === "bot_admin") word = "นี่คือคำสั่งในหมวดหมู่แอดมินของบอทค่ะ"
                    const prefix = await client.function.main.get_prefix(client, message)
                    return new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: word,
                            url: client.config.embed_author_url
                        },
                        description: client.commands.filter(cm => cm.category === category).map(cm => `**${prefix + cm.name}** - ${cm.information}`).join("\n"),
                        color: 0x00ffff
                    })
                }

                message.loading.edit({embeds:[mainEmbed], components: [components1, components2]})

                message.loading.createMessageComponentCollector({
                    filter: ({ user }) => user.id === message.author.id, time: 30 * 60000
                }).on("collect", interaction => {
                    if (interaction.customId === "home") interaction.update({embeds: [mainEmbed], components: [components1, components2]})
                    readdirSync("./src/commands").map(f => f.replace(".js", "")).forEach(async category => {
                        if (interaction.customId === category) interaction.update({embeds:[await generateEmbed(category)], components: [components1, components2]})
                    })
                })

            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
    {
        name: "horoscope",
        aliases: ["horo"],
        category: "basic",
        information: "อยากถามอะไรถามมาได้เลยนะคะ ฉันจะทำนายให้คุณเองค่ะ!",
        async run(client, message, args) {
            try {
                if (!args[0]) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "คุณต้องระบุคำถามที่จะถามด้วยนะคะ",
                        color: 0x00ffff
                    })
                ]})
                message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            name: `คำถามจาก ${message.author.tag}`,
                            icon_url: message.author.displayAvatarURL({dynamic: true})
                        },
                        fields: [
                            {
                                name: 'ถามว่า :',
                                value: args.join(" ")
                            },
                            {
                                name: 'คำตอบ',
                                value: client.function.main.random_choice([
                                    "แน่นอนอยู่แล้วค่า",
                                    "ก็น่าจะเป็นอย่างนั้นนะคะ",
                                    "โดยไม่มีข้อกังขาเลยค่ะ!",
                                    "ใช่แน่นอนค่าา",
                                    "คุณอาจพึ่งพามันได้นะคะ",
                                    "เท่าที่เค้าเห็น เค้าว่าใช่น้า",
                                    "หัวใจของฉัน..มันบอกว่าใช่ค่ะ!",
                                    "เป็นไปได้สุดๆเลยค่าา",
                                    "ก็ดูท่าจะดีนะคะ",
                                    "ใช่ค่า",
                                    "เลือกทางที่คุณอยากดีกว่านะคะ",
                                    "อะไรนะคะไม่เข้าใจ ขออีกรอบได้ไหมคะ?",
                                    "ไว้มาถามใหม่ทีหลังนะคะ..",
                                    "คุณไม่ควรรู้ตอนนี้จะดีกว่านะคะ..555",
                                    "อันนี้ฉันไม่รู้จริงๆค่ะ",
                                    "เรียบเรียงคำพูดดีๆ แล้วขออีกรอบได้ไหมคะะ",
                                    "อย่าไปนับมันเลยค่ะ",
                                    "ฉันคิดว่าไม่นะคะ",
                                    "หัวใจของฉัน..มันบอกว่าไม่ค่ะ",
                                    "ดูท่าไม่ค่อยจะดีเลยนะคะ",
                                    "แย่มากเลยค่ะ.."  
                                ])
                            }
                        ],
                        color: 0x00ffff
                    })
                ]})
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
    {
        name: "menu",
        aliases: ["กินอะไรดี"],
        category: "basic",
        information: "ไม่รู้จะกินอะไรดีงั้นหรือคะ? ลองใช้คำสั่งนี้ดูได้เลยค่ะ!",
        async run(client, message) {
            try {
                const menu = await get_menu_random(client)
                const pic = client.function.main.random_choice(JSON.parse(menu.pic))
                message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: `ลอง "${menu.menu}" มั้ยคะ?`,
                            url: pic.source
                        },
                        image: {
                            url: pic.url
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
        name: "shake",
        category: "basic",
        information: "เขย่าผู้ใช้ (เอาไว้เรียกเพื่อนอะไรงี้ค่ะ)",
        async run(client, message, args) {
            try {
                if (!args[0]) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "โปรดระบุผู้ใช้ที่ต้องการจะให้ Shake ด้วยนะคะ",
                        color: 0x00ffff
                    })
                ]})
                const member = message.mentions.members.first()

                if (member.bot) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: `ไม่สามารถ Shake ผู้ใช้ที่เป็นบอทได้นะคะ`,
                        color: 0x00ffff
                    })
                ]})

                let channel_default = member.voice.channel

                if (!channel_default) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: `\`${member.user.username}#${member.user.discriminator}\` เหมือนจะไม่ได้อยู่ในช่องเสียงนะคะ`,
                        color: 0x00ffff
                    })
                ]})

                let channels = []
                message.guild.channels.cache.forEach((channel) => {
                    if (channel.permissionsFor(member).has("CONNECT") && channel.type == "GUILD_VOICE") {
                        channels.push(channel)
                    }
                })

                message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "กำลังเขย่าผู้ใช้..",
                            url: client.config.embed_author_url
                        },
                        title: `กำลังเขย่า \`${member.user.username}#${member.user.discriminator}\``,
                        color: 0x00ffff
                    })
                ]})

                for (let i = 0; i < 4; i++) {
                    await member.voice.setChannel(channels[i])
                }
                await member.voice.setChannel(channel_default)

                message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "เขย่าผู้ใช้ เรียบร้อยค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: `เขย่า \`${member.user.username}#${member.user.discriminator}\` เรียบร้อยค่ะ!`,
                        color: 0x00ffff
                    })
                ]})

            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
    {
        name: "picsearch",
        aliases: ["pic"],
        category: "basic",
        information: "ค้นหารูปภาพ",
        async run(client, message, args) {
            try {
                if (!args[0]) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "โปรดระบุคำที่ต้องการจะให้ค้นหาด้วยนะคะ",
                        description: `เช่น \`${await client.function.main.get_prefix(client, message)}ps พิซซ่า\``,
                        color: 0x00ffff
                    })
                ]})
                const res = await client.function.api.getimgurls(client, args.join(" "), 3)
                message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: `นี่คือผลการค้นหาของ "${args.join(" ")}" ค่ะ!`,
                            url: client.config.embed_author_url
                        },
                        title: res.data[0].title,
                        url: res.data[0].source,
                        image: {
                            url: res.data[0].url
                        },
                        footer: {
                            text: "API response : " + res.ms.toLocaleString() + " ms"
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
        name: "covid",
        category: "basic",
        information: "ดูสถานการณ์ Covid-19 ล่าสุดของไทย",
        async run(client, message) {
            try {
                const res = await client.function.api.covid()
                message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "นี่คือสถานการณ์โควิดล่าสุดของไทยวันนี้ค่ะ",
                            url: "https://covid19.ddc.moph.go.th/api/Cases/today-cases-all"
                        },
                        title: `ติดเชื้อเพิ่มวันนี้ \`${res.data[0].new_case.toLocaleString()}\` คน`,
                        fields: [
                            {
                                name: `หายป่วยวันนี้ \`${res.data[0].new_recovered.toLocaleString()}\` คน`,
                                value:
                                    `หายป่วยสะสม \`${res.data[0].total_recovered.toLocaleString()}\` คน` + "\n" +
                                    `ป่วยสะสม \`${res.data[0].total_case.toLocaleString()}\` คน` + "\n" +
                                    `เสียชีวิตเพิ่ม \`${res.data[0].new_death.toLocaleString()}\` คน` + "\n"
                            }
                        ],
                        footer: {
                            text: `อัพเดตล่าสุด ${res.data[0].update_date} | API response : ${res.ms.toLocaleString()} ms`
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
        name: "time",
        aliases: ["date"],
        category: "basic",
        information: "ดูวันและเวลา ณ ขณะนี้ค่ะ!",
        async run(client, message) {
            try {
                const today = new Date()

                message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: `${
                                (String(today.getHours()).length < 2 ? "0" + today.getHours() : today.getHours()) + ":" +
                                (String(today.getMinutes()).length < 2 ? "0" + today.getMinutes() : today.getMinutes()) + ":" +
                                (String(today.getSeconds()).length < 2 ? "0" + today.getSeconds() : today.getSeconds())
                            } | ขณะนี้เวลา ${
                                String(today.getHours()).length < 2 ? "0" + today.getHours() : today.getHours()
                            } นาฬิกา ${
                                String(today.getMinutes()).length < 2 ? "0" + today.getMinutes() : today.getMinutes()
                            } นาที ${
                                String(today.getSeconds()).length < 2 ? "0" + today.getSeconds() : today.getSeconds()
                            } วินาที ค่ะ!`,
                            url: client.config.embed_author_url
                        },
                        description: `${
                            today.getDate() + '/' +
                            (today.getMonth()+1) + '/' +
                            today.getFullYear()
                        } | วัน${
                            ["อาทิตย์","จันทร์","อังคาร","พุธ","พฤหัส","ศุกร์","เสาร์"][today.getDay()]
                        } ที่ ${
                            today.getDate()
                        } เดือน${
                            ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน", "กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"][today.getMonth()]
                        } ปี ${
                            today.getFullYear()
                        }`,
                        color: 0x00ffff
                    })
                ]})
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
    {
        name: "loo",
        category: "basic",
        information: "แปลภาษาไทยไปภาษาลู (555+)",
        async run(client, message, args) {
            try {
                if (!args[0]) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "โปรดระบุคำที่ต้องการจะให้แปลด้วยนะคะ",
                        description: `เช่น \`${await client.function.main.get_prefix(client, message)}loo หลับ\``,
                        color: 0x00ffff
                    })
                ]})
                const res = await client.function.api.loo_translate(client, args.join(" "), "thai2loo")
                message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "thai2loo | " + args[0],
                            url: "http://lootranslator.infinityfreeapp.com/lootranslator.php"
                        },
                        title: res.data,
                        url: `http://lootranslator.infinityfreeapp.com/lootranslator.php?text=${args[0]}&mode=thai2loo`,
                        footer: {
                            text: "API response : " + res.ms.toLocaleString() + " ms"
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
        name: "tloo",
        category: "basic",
        information: "แปลภาษาลูมาภาษาไทย",
        async run(client, message, args) {
            try {
                if (!args[0]) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "โปรดระบุคำที่ต้องการจะให้แปลด้วยนะคะ",
                        description: `เช่น \`${await client.function.main.get_prefix(client, message)}tloo สับหลุบ\``,
                        color: 0x00ffff
                    })
                ]})
                const res = await client.function.api.loo_translate(client, args.join(" "), "loo2thai")
                message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "loo2thai | " + args[0],
                            url: "http://lootranslator.infinityfreeapp.com/lootranslator.php"
                        },
                        title: res.data,
                        url: `http://lootranslator.infinityfreeapp.com/lootranslator.php?text=${args[0]}&mode=loo2thai`,
                        footer: {
                            text: "API response : " + res.ms.toLocaleString() + " ms"
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
        name: "rank",
        category: "basic",
        information: "ดูว่าคุณอยู่อันดับที่เท่าไหร่ของดิส",
        async run(client, message) {
            const this_guild_settings = await client.function.database.get_this_guild_settings(client, message.guildId)
            if (!this_guild_settings?.ranking_exp) return message.loading.edit({embeds:[
                new MessageEmbed({
                    author: {
                        icon_url: client.user.avatarURL(),
                        name: "ไม่สามารถดำเนินการได้ค่ะ!",
                        url: client.config.embed_author_url
                    },
                    title: "ดิสนี้ยังไม่ได้เปิด Ranking System ค่ะ",
                    description: `สามารถเปิดได้โดยให้แอดมินดิส\nใช้คำสั่ง \`${await client.function.main.get_prefix(client, message)}rankingmode\` ได้เลยค่ะ`,
                    color: 0x00ffff
                })
            ]})
            const data = JSON.parse(this_guild_settings.ranking_exp).sort((a, b) => a.score - b.score).reverse()
            const this_member = data.find(m => m.member_id === message.author.id) ? data.find(m => m.member_id === message.author.id) : { member_id: message.author.id, score: 10 } 
            message.loading.edit({embeds:[
                new MessageEmbed({
                    author: {
                        icon_url: message.author.avatarURL(),
                        name: message.author.tag
                    },
                    title: `Level ของคุณในตอนนี้ คือ ${(this_member.score / 1000).toLocaleString()} | ${this_member.score.toLocaleString()} คะแนน`,
                    description: `คุณเป็นอันดับที่ ${data.includes(this_member) ? (data.indexOf(this_member) + 1).toLocaleString() : member.guild.memberCount.toLocaleString()} ของดิส`,
                    fields: [
                        {
                            name: `${message.guild.name} Level Ranking`,
                            value: data.slice(0, 14).map(m => `**${(data.indexOf(m) + 1).toLocaleString()})** *${(m.score / 1000).toLocaleString()}* | <@${m.member_id}>`).join("\n")
                        }
                    ],
                    color: 0x00ffff
                })
            ]})
        }
    }
]

function get_menu_random(client) {
    return new Promise((resolve, reject) => {
        client.datacore.query("SELECT * FROM `food`", (err, res) => {
            if (res.length > 0) {
                resolve(client.function.main.random_choice(res))
            } else {
                resolve({
                    menu: "กระเพราะหมูกรอบ",
                    value: '[{url: "https://cdn.discordapp.com/attachments/850819315745947719/901123291421495316/97410838_711254099635380_4306379715595206656_n.png", source: "https://m.facebook.com/ReviewMaiYood/posts/711257319635058"}]'
                })
            }
        })
    })
}