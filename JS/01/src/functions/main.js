const { MessageEmbed , MessageAttachment } = require('discord.js')
const { registerFont , createCanvas , loadImage } = require('canvas')

registerFont( './data/welcome/FC_Iconic_Bold.ttf', { family: "FC_Iconic_Bold" } )

module.exports = [
    {
        name: "error_log",
        run(err, client, message) {
            console.log(err)
            message.loading.edit({embeds:[
                new MessageEmbed({
                    author: {
                        name: "เกิดข้อผิดพลาดค่ะ",
                        icon_url: client.user.avatarURL({ dynamic:true }),
                        url: client.config.embed_author_url
                    },
                    color: 0x00ffff
                })
            ]})
        }
    },
    {
        name: "random_choice",
        run(list) {
            return list[Math.floor((Math.random()*list.length))]
        }
    },
    {
        name: "get_prefix",
        run(client, message) {
            return client.config.prefix
        }
    },
    {
        name: "reload",
        async run() {

        }
    },
    {
        name: "isAdmin",
        run(client, id) {
            return client.config.admin_id.includes(id)
        }
    },
    {
        name: "sendWelcomePic",
        async run(member, channel, type) {
            const canvas = createCanvas(1200, 480)
            const ctx = canvas.getContext('2d')

            const time = (new Date()).getHours()
            const background = await loadImage("./data/welcome/bg.png")
            const white_layer = await loadImage("./data/welcome/white_layer.png")
            const dark_layer = await loadImage("./data/welcome/dark_layer.png")

            const avatar = await loadImage(member.user.displayAvatarURL({ format: 'png' }) + "?size=512")

            ctx.drawImage(background, 0, 0, canvas.width, canvas.height)
            ctx.drawImage(time > 5 & time < 18 ? white_layer : dark_layer, 0, 0, canvas.width, canvas.height)

            ctx.font = member.user.tag.length < 20 ? "normal normal 92px FC_Iconic_Bold" : member.user.tag.length < 28 ? "normal normal 72px FC_Iconic_Bold" : "normal normal 42px FC_Iconic_Bold"
            ctx.fillStyle = "#2a9df4"
            ctx.fillText(`${member.user.tag}`, (canvas.width / 2) - 200, (canvas.height / 2) + 30)

            ctx.font = "normal normal 48px FC_Iconic_Bold"
            ctx.fillStyle = "#2a9df4"
            ctx.fillText(type == "JOIN" ? `ยินดีต้อนรับเข้าสู่\nดิสคอร์ด ${member.guild.name} ค่ะ!` : `ได้ออกจากดิส\n${member.guild.name} ไปแล้วค่ะ! ;w;`, (canvas.width / 2) - 220, (canvas.height / 2) + 112)

            ctx.beginPath()
            ctx.arc(210, 240, 150, 0, Math.PI * 2, true)

            ctx.closePath()
            ctx.clip()
            ctx.drawImage(avatar, 60, 90, 300, 300)

            const attachment = new MessageAttachment(canvas.toBuffer(), `${member.id + type + member.guild.id}.png`)

            channel.send({embeds:[
                new MessageEmbed({
                    author: {
                        name: type == "JOIN" ? "Member join!" : "Member left..",
                        icon_url: member.guild.iconURL({ format: 'png' }) + "?size=256"
                    },
                    description: `<@!${member.user.id}>\n${type == "JOIN" ? "ยินดีต้อนรับสู่ nicenathapong discord งับ 💕" : "ได้ออกจากดิส nicenathapong discord ไปแล้วค่ะ ;w;"}`,
                    image: {
                        url: `attachment://${attachment.name}`
                    },
                    color: 0x00ffff
                })
            ], files: [attachment]})
        }
    }
]