const { MessageEmbed } = require('discord.js')
const { readdirSync } = require('fs')

module.exports = [
    {
        name: "reload",
        async run(client, message) {
            try {
                let currentdir = __dirname
                readdirSync("./src/commands").forEach(commandFile => {
                    client.cluster.broadcastEval((client, { commandFile , currentdir }) => {
                        delete require.cache[require.resolve(currentdir + "\\" + commandFile)]
                        require(currentdir + "\\" + commandFile).forEach(c => {
                            client.commands.delete(c.name)
                            client.commands.set(c.name, c)
                        })
                        console.log(`[cluster ${client.cluster.id}] Reload extension [${commandFile.replace(".js", "")}] finish!`)
                    }, {
                        context: {
                            commandFile: commandFile,
                            currentdir: currentdir
                        }
                    })
                })
                client.cluster.broadcastEval((client, { currentdir }) => {
                    require(currentdir + "\\..\\events.js").forEach(event => {
                        client.removeAllListeners(event.name)
                        client.on(event.name, event.run.bind(null, client))
                        console.log(`[cluster ${client.cluster.id}] Reload event [${event.name}] finish!`)
                    })
                }, {
                    context: {
                        currentdir: currentdir
                    }
                })
                // readdirSync("./src/functions").forEach(functionFile => {
                //     client.cluster.broadcastEval((client, { functionFile , currentdir }) => {
                //         delete require.cache[require.resolve(currentdir + "\\..\\functions\\" + functionFile)]
                //         client.function = {}
                //         client.function[functionFile.replace(".js", "")] = {}
                //         require(currentdir + "\\..\\functions\\" + functionFile).forEach(func => {
                //             client.function[functionFile.replace(".js", "")][func.name] = func.run.bind(null)
                //             console.log(`[cluster ${client.cluster.id}] Reload function [${func.name}] finish!`)
                //         })
                //     }, {
                //         context: {
                //             functionFile: functionFile,
                //             currentdir: currentdir
                //         }
                //     })
                // })
                message.loading.edit({embeds:[
                    new MessageEmbed({
                        author: {
                            icon_url: client.user.avatarURL(),
                            name: "ดำเนินการเรียบร้อยค่ะ!",
                            url: client.config.embed_author_url
                        },
                        title: "รีโหลด Commands และ Events เรียบร้อยค่ะ",
                        color: 0x00ffff
                    })
                ]})
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
    {
        name: "",
        aliases: [""],
        async run(client, message) {
            try {
                
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    }
]