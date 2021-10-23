const Cluster = require('discord-hybrid-sharding')
const { Client , Intents , Collection } = require('discord.js')
const { Manager } = require('liliaclient')
const { QueuePlugin } = require('@liliaclient1/queue')
const { SpotifyPlugin } = require('@liliaclient1/spotify')
const fs = require('fs')
const mysql = require('mysql')
const config = require("../config")

const client = new Client({
    shards: Cluster.data.SHARD_LIST,
    shardCount: Cluster.data.TOTAL_SHARDS,
    allowedMentions: {
        parse: ['users', 'roles'],
        repliedUser: true
    },
    intents: [
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Intents.FLAGS.DIRECT_MESSAGE_TYPING,
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.GUILD_INTEGRATIONS,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
        // Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_WEBHOOKS
    ]
})

const usev13 = true
client.cluster = new Cluster.Client(client, usev13)
client.commands = new Collection()

client.mysql = mysql.createConnection(config.self_database)
client.datacore = mysql.createConnection(config.core_database)

function connect_to_database(client) {
    client.mysql.connect((err) => {
        if (err) {
            console.log(`[cluster ${client.cluster.id}] [self_db] can't connect to database.`, err)
            connect_to_database(client)
        }
        console.log(`[cluster ${client.cluster.id}] [self_db] connect to database finish!`)
    })
    client.datacore.connect((err) => {
        if (err) {
            console.log(`[cluster ${client.cluster.id}] [core_db] can't connect to database.`, err)
            connect_to_database(client)
        }
        console.log(`[cluster ${client.cluster.id}] [core_db] connect to database finish!`)
    })
    client.mysql.on("error", (err) => {
        console.log(`[cluster ${client.cluster.id}] [self_db] database error.`, err)
        connect_to_database(client)
    })
    client.datacore.on("error", (err) => {
        console.log(`[cluster ${client.cluster.id}] [core_db] database error.`, err)
        connect_to_database(client)
    })
}

connect_to_database(client)

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

require("./events").forEach(e => {
    client.on(e.name, e.run.bind(null, client))
    console.log(`[cluster ${client.cluster.id}] Loading event "${e.name}" finish!`)
})

fs.readdirSync("./src/commands").forEach(commandFile => {
    require("./commands/" + commandFile).forEach(c => {
        client.commands.set(c.name, c)
    })
    console.log(`[cluster ${client.cluster.id}] Loading extension [${commandFile.replace(".js","")}] finish!`)
})

client.login(config.token)