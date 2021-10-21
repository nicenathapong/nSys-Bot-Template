const { MessageEmbed } = require('discord.js')
const config = require("../config")

module.exports = [
    {
        name: "ready",
        async run(client) {
            console.log(
                "\n---------------------------------------------" + "\n" +
                `nSys is starting up! | Cluster ${client.cluster.id}` + "\n" +
                `Login as ${client.user.tag} | ${client.user.id}` + "\n" +
                "---------------------------------------------"
            )
        }
    },
    {
        name: "messageCreate",
        async run(client, message) {
            if (message.author.bot) return
            let prefix = config.prefix
            if (message.content.startsWith(prefix)) {
                const args = message.content.slice(prefix.length).split(/\s+/)
                const command = args.shift().toLowerCase()
                run_commands(command, client, message, args)
            }
        }
    }
]

async function run_commands(command, client, message, args) {
    const cmd = client.commands.find(cmd => cmd.aliases?.includes(command)) ? client.commands.find(cmd => cmd.aliases?.includes(command)) : client.commands.get(command)
    if (!cmd) return
    message.loading = await message.reply({embeds:[
        new MessageEmbed({
            author: {
                name: "โปรดรอสักครู่นะคะ",
                icon_url: client.user.avatarURL({ dynamic:true })
            },
            title: "กำลังทำการดึงข้อมูลค่ะ...",
            color: 0x00ffff
        })
    ]})
    await cmd.run(client, message, args).then(() => {
        console.log(`\nCommand use! | ${message.content} | ${message.guild.name} | ${message.author.tag}`)
        client.cluster.broadcastEval(async (client, { log_channels , embed }) => {
            log_channels.forEach(async chid => {
                const channel = await client.channels.cache.get(chid)
                if (channel) channel.send({embeds:[embed]})
            })
        },{
            context: {
                log_channels: config.log_channels,
                embed: new MessageEmbed({
                    author: {
                        name: "Command use!",
                        icon_url: message.guild.iconURL(),
                        url: config.embed_author_url
                    },
                    title: message.content,
                    description: `${message.guild.name} | ${message.author.tag}`,
                    color: 0x00ffff
                })
            }
        })
    })
}