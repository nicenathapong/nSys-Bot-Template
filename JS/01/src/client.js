const Cluster = require('discord-hybrid-sharding')
const { Client , Intents } = require('discord.js')

process.setMaxListeners(0)
require('child_process').ChildProcess.setMaxListeners(0)

const intents = new Intents([
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
])

const client = new Client({
    shards: Cluster.data.SHARD_LIST,
    shardCount: Cluster.data.TOTAL_SHARDS,
    allowedMentions: {
        parse: ['users', 'roles'],
        repliedUser: true
    },
    intents: intents
})

const usev13 = true
client.cluster = new Cluster.Client(client, usev13)
client.config = require("../config")
require("./handles/database")(client)
require("./handles/music")(client)
require("./handles/events")(client)
require("./handles/commands")(client)
require("./handles/functions")(client)

client.login(client.config.token)