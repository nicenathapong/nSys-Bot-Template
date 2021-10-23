const { MessageEmbed , MessageButton, MessageActionRow, Message } = require('discord.js')
const config = require("../../config")
const { error_log , random_choice , get_prefix } = require("../functions/main")
const api = require("../functions/api")

module.exports = [
    {
        name: "help",
        aliases: ["h"],
        category: "basic",
        information: "หน้าช่วยเหลือของบอท",
        async run(client, message) {
            try {
                const MainButton = new MessageButton({
                    style: 'SUCCESS',
                    emoji: "⚓",
                    label: "หน้าหลัก",
                    customId: "Main"
                })
                const BasicButton = new MessageButton({
                    style: 'SECONDARY',
                    emoji: "🏠",
                    label: "ทั่วไป",
                    customId: "Basic"
                })

                const MainEmbed = new MessageEmbed({
                    author: {
                        icon_url: client.user.avatarURL(),
                        name: "สวัสดีค่ะ! มีอะไรให้ช่วยไหมคะ?",
                        url: config.embed_author_url
                    },
                    title: "สามารถดูคำสั่งทั้งหมดได้ที่เมนูด้านล่างเลยค่ะ",
                    image: {
                        url: "https://cdn.discordapp.com/attachments/874955958718201887/899627468200230962/nSys.png"
                    },
                    color: 0x00ffff
                })
                const BasicEmbed = new MessageEmbed({
                    author: {
                        icon_url: client.user.avatarURL(),
                        name: "นี่คือคำสั่งทั่วไปของบอทค่ะ!",
                        url: config.embed_author_url
                    },
                    description: client.commands.filter(cm => cm.category === "basic").map(cm => `**${get_prefix(client, message) + cm.name}** - ${cm.information}`).join("\n"),
                    color: 0x00ffff
                })

                const msg = await message.loading.edit({embeds:[MainEmbed], components:[new MessageActionRow({components: [MainButton, BasicButton]})]})
                
                const collector = msg.createMessageComponentCollector({
                    filter: ({ user }) => user.id === message.author.id, time: 30 * 60000
                })

                collector.on("collect", interaction => {
                    if (interaction.customId === "Main") interaction.update({embeds:[MainEmbed], components:[new MessageActionRow({components: [MainButton, BasicButton]})]})
                    if (interaction.customId === "Basic") interaction.update({embeds:[BasicEmbed], components:[new MessageActionRow({components: [MainButton, BasicButton]})]})
                })

            } catch (e) {
                error_log(e, client, message)
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
                            url: config.embed_author_url
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
                                value: random_choice([
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
                error_log(e, client, message)
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
                const pic = random_choice(JSON.parse(menu.pic))
                message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: `ลอง ${menu.menu} มั้ยคะ?`,
                            url: pic.source
                        },
                        image: {
                            url: pic.url
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
                            url: config.embed_author_url
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
                            url: config.embed_author_url
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
                            url: config.embed_author_url
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
                            url: config.embed_author_url
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
                            url: config.embed_author_url
                        },
                        title: `เขย่า \`${member.user.username}#${member.user.discriminator}\` เรียบร้อยค่ะ!`,
                        color: 0x00ffff
                    })
                ]})

            } catch (e) {
                error_log(e, client, message)
            }
        }
    },
    {
        name: "picsearch",
        aliases: ["ps"],
        category: "basic",
        information: "ค้นหารูปภาพ",
        async run(client, message, args) {
            try {
                if (!args[0]) return message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ไม่สามารถดำเนินการได้ค่ะ!",
                            url: config.embed_author_url
                        },
                        title: "โปรดระบุคำที่ต้องการจะให้ค้นหาด้วยนะคะ",
                        description: `เช่น \`${get_prefix(client, message)}ps พิซซ่า\``,
                        color: 0x00ffff
                    })
                ]})
                const res = await api.getimgurls(args.join(" "), 3)
                message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: `นี่คือผลการค้นหาของ "${args.join(" ")}" ค่ะ!`,
                            url: config.embed_author_url
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
                error_log(e, client, message)
            }
        }
    },
    {
        name: "covid",
        category: "basic",
        information: "ดูสถานการณ์ Covid-19 ล่าสุดของไทย",
        async run(client, message) {
            try {
                const res = await api.covid()
                console.log(res.data)
                message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "นี่คือสถานการณ์โควิดล่าสุดของไทยวันนี้ค่ะ",
                            url: "https://covid19.ddc.moph.go.th/api/Cases/today-cases-all"
                        },
                        title: `ติดเชื้อเพิ่มวันนี้ \`${res.data[0].new_case}\` คน`,
                        fields: [
                            {
                                name: `หายป่วยวันนี้ \`${res.data[0].new_recovered}\` คน`,
                                value:
                                    `หายป่วยสะสม \`${res.data[0].total_recovered}\` คน` + "\n" +
                                    `ป่วยสะสม \`${res.data[0].total_case}\` คน` + "\n" +
                                    `เสียชีวิตเพิ่ม \`${res.data[0].new_death}\` คน` + "\n"
                            }
                        ],
                        footer: {
                            text: `อัพเดตล่าสุด ${res.data[0].update_date} | API response : ${res.ms} ms`
                        }
                    })
                ]})
            } catch (e) {
                error_log(e, client, message)
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
                            url: config.embed_author_url
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
                error_log(e, client, message)
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
                            url: config.embed_author_url
                        },
                        title: "โปรดระบุคำที่ต้องการจะให้แปลด้วยนะคะ",
                        description: `เช่น \`${get_prefix(client, message)}loo หลับ\``,
                        color: 0x00ffff
                    })
                ]})
                const res = await api.loo_translate(args.join(" "), "thai2loo")
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
                error_log(e, client, message)
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
                            url: config.embed_author_url
                        },
                        title: "โปรดระบุคำที่ต้องการจะให้แปลด้วยนะคะ",
                        description: `เช่น \`${get_prefix(client, message)}tloo สับหลุบ\``,
                        color: 0x00ffff
                    })
                ]})
                const res = await api.loo_translate(args.join(" "), "loo2thai")
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
                error_log(e, client, message)
            }
        }
    }
]

function get_menu_random(client) {
    return new Promise((resolve, reject) => {
        client.datacore.query("SELECT * FROM `food`", (err, res) => {
            if (res.length > 0) {
                resolve(random_choice(res))
            } else {
                resolve({
                    menu: "กระเพราะหมูกรอบ",
                    value: '[{url: "https://cdn.discordapp.com/attachments/850819315745947719/901123291421495316/97410838_711254099635380_4306379715595206656_n.png",source: "https://m.facebook.com/ReviewMaiYood/posts/711257319635058"}]'
                })
            }
        })
    })
}