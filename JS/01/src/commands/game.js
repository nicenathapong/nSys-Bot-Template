const { MessageEmbed } = require('discord.js')
const request = require('request')

module.exports = [
    {
        name: "youtube",
        aliases: ["ytt","youtube-together"],
        category: "game",
        information: "สร้าง activity discord - Youtube Together",
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
                        description: "คุณต้องอยู่ในช่องเสียงก่อน จึงจะสามารถสร้างได้นะคะ",
                        color: 0x00ffff
                    })
                ]})
                message.loading.edit({content: `<@!${message.author.id}> ได้สร้างกิจกรรม **Youtube Together** แล้วค่ะ!\n${await gen_activity_link(client, channel.id, "880218394199220334")}`, embeds:[]})
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
    {
        name: "poker",
        category: "game",
        information: "สร้าง activity discord - Poker Night",
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
                        description: "คุณต้องอยู่ในช่องเสียงก่อน จึงจะสามารถสร้างได้นะคะ",
                        color: 0x00ffff
                    })
                ]})
                message.loading.edit({content: `<@!${message.author.id}> ได้สร้างกิจกรรม **Poker Night** แล้วค่ะ!\n${await gen_activity_link(client, channel.id, "755827207812677713")}`, embeds:[]})
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
    {
        name: "betrayal",
        category: "game",
        information: "สร้าง activity discord - Betrayal io",
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
                        description: "คุณต้องอยู่ในช่องเสียงก่อน จึงจะสามารถสร้างได้นะคะ",
                        color: 0x00ffff
                    })
                ]})
                message.loading.edit({content: `<@!${message.author.id}> ได้สร้างกิจกรรม **Betrayal io** แล้วค่ะ!\n${await gen_activity_link(client, channel.id, "773336526917861400")}`, embeds:[]})
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
    {
        name: "fishing",
        category: "game",
        information: "สร้าง activity discord - Fishington io",
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
                        description: "คุณต้องอยู่ในช่องเสียงก่อน จึงจะสามารถสร้างได้นะคะ",
                        color: 0x00ffff
                    })
                ]})
                message.loading.edit({content: `<@!${message.author.id}> ได้สร้างกิจกรรม **Fishington io** แล้วค่ะ!\n${await gen_activity_link(client, channel.id, "814288819477020702")}`, embeds:[]})
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
    {
        name: "chess",
        category: "game",
        information: "สร้าง activity discord - Chess in the Park",
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
                        description: "คุณต้องอยู่ในช่องเสียงก่อน จึงจะสามารถสร้างได้นะคะ",
                        color: 0x00ffff
                    })
                ]})
                message.loading.edit({content: `<@!${message.author.id}> ได้สร้างกิจกรรม **Chess in the Park** แล้วค่ะ!\n${await gen_activity_link(client, channel.id, "832012774040141894")}`, embeds:[]})
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
    {
        name: "letter-tile",
        category: "game",
        information: "สร้าง activity discord - Letter Tile",
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
                        description: "คุณต้องอยู่ในช่องเสียงก่อน จึงจะสามารถสร้างได้นะคะ",
                        color: 0x00ffff
                    })
                ]})
                message.loading.edit({content: `<@!${message.author.id}> ได้สร้างกิจกรรม **Letter Tile** แล้วค่ะ!\n${await gen_activity_link(client, channel.id, "879863686565621790")}`, embeds:[]})
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
    {
        name: "word-snack",
        category: "game",
        information: "สร้าง activity discord - Word Snack",
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
                        description: "คุณต้องอยู่ในช่องเสียงก่อน จึงจะสามารถสร้างได้นะคะ",
                        color: 0x00ffff
                    })
                ]})
                message.loading.edit({content: `<@!${message.author.id}> ได้สร้างกิจกรรม **Word Snack** แล้วค่ะ!\n${await gen_activity_link(client, channel.id, "879863976006127627")}`, embeds:[]})
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
    {
        name: "doodle-crew",
        category: "game",
        information: "สร้าง activity discord - Doodle Crew",
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
                        description: "คุณต้องอยู่ในช่องเสียงก่อน จึงจะสามารถสร้างได้นะคะ",
                        color: 0x00ffff
                    })
                ]})
                message.loading.edit({content: `<@!${message.author.id}> ได้สร้างกิจกรรม **Doodle Crew** แล้วค่ะ!\n${await gen_activity_link(client, channel.id, "878067389634314250")}`, embeds:[]})
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
]

function gen_activity_link(client, channel_id, game_id) {
    return new Promise((resolve, reject) => {
        request.post({
            url: `https://discord.com/api/v9/channels/${channel_id}/invites`,
            headers: {
                "Authorization": `Bot ${client.config.token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                max_age: 0,
                max_uses: 0,
                target_application_id: game_id,
                target_type: 2,
                temporary: false,
                validate: null,
            })
        }, (err, res) => {
            if (err) reject("[err] request error.", err)
            if (!res.body) reject("[err] request error, response is don't body.")
            resolve("https://discord.gg/" + JSON.parse(res.body).code)
        })
    })
}