const { Collection } = require('discord.js')
const { readdirSync } = require('fs')

module.exports = (client) => {
    client.commands = new Collection()
    let all_commands_status = []
    readdirSync("./src/commands").forEach(commandFile => {
        require("../commands/" + commandFile).forEach(c => {
            if (c.name.length > 0) {
                client.commands.set(c.name, c)
                all_commands_status.push(new command_status(client.cluster.id, commandFile.replace(".js",""), c.name, "ready"))
            } else all_commands_status.push(new command_status(client.cluster.id, commandFile.replace(".js",""), c.name, "not_ready"))
        })
    })
    console.table(all_commands_status)
}

class command_status {
    constructor(cluster_id, extension, command_name, status) {
        this.cluster_id = cluster_id
        this.extension = extension,
        this.command_name = command_name,
        this.status = status
    }
}