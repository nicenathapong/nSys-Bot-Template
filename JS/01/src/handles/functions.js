const { readdirSync } = require('fs')

module.exports = (client) => {
    client.function = {}
    let all_functions_status = []
    readdirSync("./src/functions").forEach(functionFile => {
        client.function[functionFile.replace(".js", "")] = {}
        require("../functions/" + functionFile).forEach(func => {
            if (func.run) {
                client.function[functionFile.replace(".js", "")][func.name] = func.run.bind(null)
                all_functions_status.push(new function_status(client.cluster.id, functionFile.replace(".js",""), func.name, "ready"))
            } else all_functions_status.push(new function_status(client.cluster.id, functionFile.replace(".js",""), func.name, "not_ready"))
        })
    })
    console.table(all_functions_status)
}

class function_status {
    constructor(cluster_id, category, function_name, status) {
        this.cluster_id = cluster_id
        this.category = category
        this.function_name = function_name,
        this.status = status
    }
}