const { Manager } = require('liliaclient')
const { QueuePlugin } = require('@liliaclient1/queue')
const { SpotifyPlugin } = require('@liliaclient1/spotify')
const config = require("../../config")

module.exports = (client) => {
    client.manager = new Manager(config.lavalink, {
        send: (id, payload) => {
            const guild = client.guilds.cache.get(id)
            if (guild) guild.shard.send(payload)
        },
        reconnect: {
            auto: true,
            maxTries: 10000000,
            delay: 15
        },
        plugins: [
            new QueuePlugin(),
            new SpotifyPlugin(config.spotifyClient)
        ],
        filters: {
            nightcore: { rate: 1.1, pitch: 1.0, speed: 1 },
            vaporwave: { rate: 0.95, pitch: 0.9, speed: 1 }
        }
    })
    
    client.manager.on('socketReady', (node) => {
        console.log(`Music node [${node.id}] Connected!`)
    })
    
    client.manager.on('socketError', ({ id }, err) => {
        console.log(`Music node [${id}] error.`, err)
    })
    
    client.ws.on("VOICE_STATE_UPDATE", (upd) => client.manager.stateUpdate(upd))
    client.ws.on("VOICE_SERVER_UPDATE", (upd) => client.manager.serverUpdate(upd))
}