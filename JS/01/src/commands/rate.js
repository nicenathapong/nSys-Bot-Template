const { MessageEmbed , MessageActionRow } = require('discord.js')
const cheerio = require('cheerio')

module.exports = [
    {
        name: "rule34",
        aliases: ["r34"],
        category: "rate",
        information: "ดูรูปภาพของ tags ใน Rule34",
        async run(client, message, args) {
            try {
                const database_tags = await client.function.database.core_r34(client)
                let tags
                if (!args[0]) tags = client.function.main.random_choice(database_tags.map(t => t.tags))
                else tags = args[0]
                let pics
                if (!database_tags.map(t => t.tags).includes(tags)) {
                    pics = await client.function.api.rule34(tags)
                    if (pics === "NO_PIC_FROM_RULE34") return message.loading.edit({embeds:[
                        new MessageEmbed({
                            author: {
                                icon_url: client.user.avatarURL(),
                                name: "ไม่สามารถดำเนินการได้ค่ะ!",
                                url: client.config.embed_author_url
                            },
                            title: `ไม่พบแท็ก "${tags}" ใน rule34 ค่ะ`,
                            color: 0x00ffff
                        })
                    ]})
                    client.datacore.query(`INSERT INTO \`rule34\` (id, tags, pic) VALUES (NULL, '${tags}', '${JSON.stringify(pics)}')`, (err, ins) => { if (err) throw err })
                } else pics = JSON.parse(database_tags.find(t => t.tags === tags).pic)
                
                function generateEmbed(index) {
                    return new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "rule34",
                            url: "https://rule34.xxx/"
                        },
                        title: tags,
                        url: "https://rule34.xxx/index.php?page=post&s=list&tags=" + tags,
                        image: {
                            url: pics[index]
                        },
                        footer: {
                            text: pics.length > 1 ? `นี่คือรูปที่ ${index + 1} จากทั้งหมด ${pics.length} รูป ของแท็กค่ะ` : ""
                        },
                        color: 0x00ffff
                    })
                }

                const canFitOnOnePage = pics.length <= 1

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
                                ...(currentIndex + 1 < pics.length ? [client.utils.button().forward] : [])
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
        name: "nhentai",
        aliases: ["nht"],
        category: "rate",
        information: "random nhentai",
        async run(client, message) {
            try {
                async function generateEmbed() {
                    const data = await client.function.api.getnhtrandom()
                    const $ = cheerio.load(data.data)
                    const title = $('meta[property="og:title"]').attr('content')
                    const imgurl = $('meta[property="og:image"]').attr('content')
                    return new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "nhentai",
                            url: "https://nhentai.net/"
                        },
                        title: title,
                        url: data.url,
                        image: {
                            url: imgurl
                        },
                        footer: {
                            text: "API response : " + data.ms.toLocaleString() + " ms"
                        },
                        color: 0x00ffff
                    })
                }

                message.loading.edit({embeds: [await generateEmbed()], components: [new MessageActionRow({components: [client.utils.button().forward]})]})

                message.loading.createMessageComponentCollector({
                    filter: ({user}) => user.id === message.author.id, time: 30 * 60000
                }).on("collect", async interaction => {
                    interaction.update({
                        embeds: [await generateEmbed()],
                        component: [new MessageActionRow({components: [client.utils.button().forward]})]
                    })
                })
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    }
]