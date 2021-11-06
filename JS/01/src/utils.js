const { MessageEmbed, MessageActionRow , MessageButton } = require('discord.js')

const components = [new MessageActionRow({
    components: [
        new MessageButton({
            style: "SECONDARY",
            emoji: "🔂",
            customId: "looptrk"
        }),
        new MessageButton({
            style: "SECONDARY",
            emoji: "⏮️",
            customId: "previous"
        }),
        new MessageButton({
            style: "SUCCESS",
            emoji: "▶",
            customId: "play"
        }),
        new MessageButton({
            style: "SECONDARY",
            emoji: "⏭️",
            customId: "skip"
        }),
        new MessageButton({
            style: "SECONDARY",
            emoji: "🔁",
            customId: "loopq"
        })
    ]
}), new MessageActionRow({
    components: [
        new MessageButton({
            style: "PRIMARY",
            emoji: "🔊",
            customId: "volup"
        }),
        new MessageButton({
            style: "PRIMARY",
            emoji: "🔉",
            customId: "voldown"
        }),
        new MessageButton({
            style: "DANGER",
            emoji: "⏏️",
            customId: "leave"
        }),
        new MessageButton({
            style: "PRIMARY",
            emoji: "🔇",
            customId: "mute"
        }),
        new MessageButton({
            style: "PRIMARY",
            emoji: "🔀",
            customId: "sf"
        })
    ]
})]

module.exports = [
    {
        name: "player_msg_default",
        run(client) {
            return {embeds:[new MessageEmbed({
                author: {
                    icon_url: client.user.avatarURL(),
                    name: `🎶 ${client.user.username} Music player`,
                    url: client.config.embed_author_url
                },
                title: "ไม่มีเพลงที่กำลังเล่นในขณะนี้ค่ะ",
                description: "สามารถเริ่มเล่นเพลง ได้โดยการนำเพลงมาใส่ช่องนี้ได้เลยค่ะ!",
                image: {
                    url: client.config.help_image
                },
                color: 0x00ffff
            })], components: components }
        }
    },
    {
        name: "player_msg_playing",
        run(client, player) {
            if (player.queue.current?.title) return {embeds: [new MessageEmbed({
                author: {
                    icon_url: client.user.avatarURL(),
                    name: `🎶 ${client.user.username} Music player | ขณะนี้กำลังเล่นเพลง`,
                    url: client.config.embed_author_url
                },
                title: player.queue.current.title,
                url: player.queue.current.uri,
                fields: [
                    {
                        name: "จากช่อง",
                        value: "`" + player.queue.current.author + "`",
                        inline: true
                    },
                    {
                        name: "ขอเพลงโดย",
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
                    text: `เล่นอยู่ที่ node [${player.socket.id}] | ระดับเสียงอยู่ที่ ${player.volume}% | โหมดการเล่น [${!player.queue._loop || player.queue._loop === "undefined" ? "None" : player.queue._loop}]`
                },
                color: 0x00ffff
            })], components: components }
            return client.utils.player_msg_playing(client)
        }
    }
]