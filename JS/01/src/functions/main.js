const { MessageEmbed , MessageAttachment } = require('discord.js')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const { registerFont , createCanvas , loadImage } = require('canvas')
const { readdirSync } = require('fs')

registerFont(__dirname + (process.platform === "win32" ? "\\..\\..\\data\\welcome\\FC_Iconic_Bold.ttf" : "/../../data/welcome/FC_Iconic_Bold.ttf"), { family: "FC_Iconic_Bold" } )

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
                    title: "โปรดรอสักครู่ แล้วลองอีกครั้งนะคะ",
                    color: 0x00ffff
                })
            ]})
            client.cluster.broadcastEval(async (client, { log_channels , embed }) => {
                log_channels.forEach(async chid => {
                    const channel = await client.channels.fetch(chid)
                    if (channel) channel.send({embeds:[embed]})
                })
            },{
                context: {
                    log_channels: client.config.log_channels,
                    embed: new MessageEmbed({
                        author: {
                            name: "Error detected! | " + message.guild.name,
                            icon_url: message.guild.iconURL(),
                            url: client.config.embed_author_url
                        },
                        title: message.content,
                        description: "```js" + err + "```",
                        color: 0x00ffff
                    })
                }
            })
        }
    },
    {
        name: "random_choice",
        run(list) {
            return list[Math.floor((Math.random()*list.length))]
        }
    },
    {
        name: "isNum",
        run(str) {
            if (typeof str != "string") return false
            return !isNaN(str) && !isNaN(parseFloat(str))
        }
    },
    {
        name: "get_prefix",
        async run(client, message) {
            const this_guild_settings = await client.function.database.get_this_guild_settings(client, message.guildId)
            if (this_guild_settings?.custom_prefix) return this_guild_settings.custom_prefix
            return client.config.prefix
        }
    },
    {
        name: "reload",
        async run(client) {
            client.config = {}
            delete require.cache[require.resolve("../../config")]
            client.config = require("../../config")
            console.log(`\n[cluster ${client.cluster.id}] Reload config finish!`)
            readdirSync(__dirname + (process.platform === "win32" ? "\\..\\..\\src\\commands" : "/../../src/commands")).forEach(commandFile => {
                delete require.cache[require.resolve("../commands/" + commandFile)]
                require("../commands/" + commandFile).forEach(c => {
                    client.commands.delete(c.name)
                    client.commands.set(c.name, c)
                })
                console.log(`[cluster ${client.cluster.id}] Reload extension [${commandFile.replace(".js", "")}] finish!`)
            })
            delete require.cache[require.resolve("../slashcommands")]
            client.slashcommands_arr = []
            require("../slashcommands").forEach(slc => {
                client.slashcommands.delete(slc.data.name)
                client.slashcommands.set(slc.data.name, slc)
                client.slashcommands_arr.push(slc.data)
                console.log(`[cluster ${client.cluster.id}] Reload SlashCommands [${slc.data.name}] finish!`)
            })

            const rest = new REST({ version: '9' }).setToken(client.token)
            try {
                if (client.config.loadSlashGlobal) {
                    await rest.put(Routes.applicationCommands(client.user.id), { body: client.slashcommands_arr })
                } else {
                    client.config.guildTest.forEach(async id => {
                        await rest.put(Routes.applicationGuildCommands(client.user.id, id), { body: client.slashcommands_arr })
                    })
                }
            } catch (e) { console.log(e) }
            
            delete require.cache[require.resolve("../events")]
            require("../events").forEach(event => {
                client.removeAllListeners(event.name)
                client.on(event.name, event.run.bind(null, client))
                console.log(`[cluster ${client.cluster.id}] Reload event [${event.name}] finish!`)
            })
            client.function = {}
            readdirSync(__dirname + (process.platform === "win32" ? "\\..\\..\\src\\functions" : "/../../src/functions")).forEach(functionFile => {
                delete require.cache[require.resolve("../functions/" + functionFile)]
                client.function[functionFile.replace(".js", "")] = {}
                require("../functions/" + functionFile).forEach(func => {
                    client.function[functionFile.replace(".js", "")][func.name] = func.run.bind(null)
                    console.log(`[cluster ${client.cluster.id}] Reload function [${func.name}] finish!`)
                })
            })
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
            const background = await loadImage(__dirname + (process.platform === "win32" ? "\\..\\..\\data\\welcome\\bg.png" : "/../../data/welcome/bg.png"))
            const white_layer = await loadImage(__dirname + (process.platform === "win32" ? "\\..\\..\\data\\welcome\\white_layer.png" : "/../../data/welcome/white_layer.png"))
            const dark_layer = await loadImage(__dirname + (process.platform === "win32" ? "\\..\\..\\data\\welcome\\dark_layer.png" : "/../../data/welcome/dark_layer.png"))

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
                    description: `<@!${member.user.id}>\n${type == "JOIN" ? `ยินดีต้อนรับสู่ ${member.guild.name} งับ 💕` : `ได้ออกจากดิส ${member.guild.name} ไปแล้วค่ะ ;w;`}`,
                    image: {
                        url: `attachment://${attachment.name}`
                    },
                    color: 0x00ffff
                })
            ], files: [attachment]})
        }
    }
]