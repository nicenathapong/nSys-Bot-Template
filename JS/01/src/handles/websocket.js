const WebSocket = require('ws')

module.exports = (client) => {
    client.wss = new WebSocket(client.config.ws_url)

    client.wss.on("open", () => {
        client.wss.send(JSON.stringify({
            op: "authorization",
            user: client.user.username
        }))
    })

    client.wss.on("message", message => {
        const data = JSON.parse(message)
        if (data.op === "message") {
            console.log("------------wss------------\nmessage from : " + data.user + "\n" + data.data + "\n---------------------------")
        }
    })
}