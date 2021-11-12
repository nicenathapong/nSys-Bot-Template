const { MessageEmbed } = require('discord.js')

module.exports = [
    {
        name: "kick",
        category: "guild_admin",
        information: "เตะผู้ใช้",
        async run(client, message) {
            try {
                
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
    {
        name: "ban",
        category: "guild_admin",
        information: "แบนผู้ใช้",
        async run(client, message) {
            try {
                
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
    {
        name: "unban",
        category: "guild_admin",
        information: "ปลดแบนผู้ใช้",
        async run(client, message) {
            try {
                
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
    {
        name: "edit-server-icon",
        aliases: ["editsvi"],
        category: "guild_admin",
        information: "เปลี่ยนไอคอนเซิร์ฟเวอร์ของคุณ",
        async run(client, message) {
            try {
                
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
    {
        name: "restore-server-icon",
        aliases: ["restoresvi"],
        category: "guild_admin",
        information: "คืนค่าไอคอนของเซิร์ฟเวอร์ไปยังรูปเดิม",
        async run(client, message) {
            try {
                
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
    {
        name: "edti-server-name",
        category: "guild_admin",
        information: "เปลี่ยนไอคอนของเซิร์ฟเวอร์",
        async run(client, message) {
            try {
                
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    },
    {
        name: "change-nickname",
        category: "guild_admin",
        information: "เปลี่ยนชื่อเล่นผู้ใช้",
        async run(client, message) {
            try {
                
            } catch (e) {
                client.function.main.error_log(e, client, message)
            }
        }
    }
]