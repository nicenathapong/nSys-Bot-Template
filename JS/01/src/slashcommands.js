const { MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = [
    {
        data: {
            name: "ping",
            description: "ตรวจสอบความหน่วงของบอท",
            option: [],
            defaultPermission: undefined
        },
        async run(client, interaction) {
            interaction.reply({embeds:[
                new MessageEmbed({
                    author: {
                        icon_url: client.user.avatarURL(),
                        name: `ปิงของบอทตอนนี้ อยู่ที่ ${client.ws.ping}ms ค่ะ!`,
                        url: client.config.embed_author_url
                    },
                    color: 0x00ffff
                })
            ]})
        }
    }
]