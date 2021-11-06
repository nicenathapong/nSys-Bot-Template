module.exports = (client) => {
    client.utils = {}
    require("../utils").forEach(u => {
        client.utils[u.name] = u.run.bind(null)
    })
}