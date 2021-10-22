const { MessageEmbed } = require('discord.js')
const config = require("../../config")
const { error_log } = require("../functions/main")

module.exports = [
    {
        name: "help",
        aliases: ["h"],
        async run(client, message) {
            try {
                
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
                
            } catch (e) {
                error_log(message, e)
            }
        }
    }
]