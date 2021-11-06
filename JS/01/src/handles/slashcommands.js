const { Collection } = require('discord.js')

module.exports = (client) => {
    client.slashcommands = new Collection()
    client.slashcommands_arr = []
    let all_commands_status = []
    require("../slashcommands").forEach(command => {
        if (command.data.name.length > 0) {
            client.slashcommands.set(command.data.name, command)
            client.slashcommands_arr.push(command.data.toJSON())
            all_commands_status.push(new command_status(client.cluster.id, command.data.name, "ready"))
        } else all_commands_status.push(new command_status(client.cluster.id, command.data.name, "not_ready"))
    })
    console.table(all_commands_status)
}

class command_status {
    constructor(cluster_id, SlashCommand_name, status) {
        this.cluster_id = cluster_id
        this.SlashCommand_name = SlashCommand_name
        this.status = status
    }
}