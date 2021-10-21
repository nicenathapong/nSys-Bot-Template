const { MessageEmbed } = require('discord.js')
const config = require("../../config")

function error_log(err, message) {
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

module.exports = {
    error_log
    
}