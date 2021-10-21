const { MessageEmbed } = require('discord.js')
const config = require("../../config")
const { error_log } = require("../functions/main")

module.exports = [
    {
        name: "help",
        aliases: ["h"],
        async run(client, message) {
            try {
                message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            name: `ปิงของบอทตอนนี้ อยู่ที่ ${client.ws.ping.toFixed(0)}ms ค่ะ!`,
                            icon_url: client.user.avatarURL({ dynamic:true })
                        },
                        color: 0x00ffff
                    })
                ]})
            } catch (e) {
                error_log(message, e)
            }
        }
    },
    {
        name: "horoscope",
        aliases: ["horo"],
        async run(client, message) {
            try {
                message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            name: `ปิงของบอทตอนนี้ อยู่ที่ ${client.ws.ping}ms ค่ะ!`,
                            icon_url: client.user.avatarURL({ dynamic:true })
                        },
                        color: 0x00ffff
                    })
                ]})
            } catch (e) {
                error_log(message, e)
            }
        }
    }
]