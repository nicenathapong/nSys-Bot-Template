const { MessageEmbed } = require('discord.js')
const config = require("../../config")

function error_log(err, client, message) {
    console.log(err)
    message.loading.edit({embeds:[
        new MessageEmbed({
            author: {
                name: "เกิดข้อผิดพลาดค่ะ",
                icon_url: client.user.avatarURL({ dynamic:true }),
                url: config.embed_author_url
            },
            description: `\`\`\`${err.code == "ETIMEDOUT" ? "Error: connect ETIMEDOUT" : err}\`\`\``,
            color: 0x00ffff
        })
    ]})
}

function get_prefix(client, message) {
    return config.prefix
}

function random_choice(list) {
    return list[Math.floor((Math.random()*list.length))]
}

module.exports = {
    error_log,
    random_choice,
    get_prefix,
}