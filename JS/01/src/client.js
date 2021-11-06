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
require("./handles/functions")(client)
require("./handles/utils")(client)
require("./handles/events")(client)
require("./handles/commands")(client)
require("./handles/slashcommands")(client)

client.login(client.config.token)

process.on('unhandledRejection', (reason, p) => {
    if (reason.message === "Missing Access" && reason.path.split("/")[5] === "commands") {
        console.log("\n[err] Missing Access to put SlashCommands | guildId => " + reason.path.split("/")[4])
    } else {
        console.log('\n=== unhandled Rejection ==='.toUpperCase())
        console.log('Promise: ', p , 'Reason: ', reason.stack ? reason.stack : reason);
        console.log('=== unhandled Rejection ==='.toUpperCase())
    }
})
process.on("uncaughtException", (err, origin) => {
    console.log('\n=== uncaught Exception ==='.toUpperCase())
    console.log('Origin: ', origin, 'Exception: ', err.stack ? err.stack : err)
    console.log('=== uncaught Exception ==='.toUpperCase())
})
process.on('uncaughtExceptionMonitor', (err, origin) => {
    console.log('\n=== uncaught Exception Monitor ==='.toUpperCase())
    console.log('Origin: ', origin, 'Exception: ', err.stack ? err.stack : err)
    console.log('=== uncaught Exception Monitor ==='.toUpperCase())
})
process.on('beforeExit', (code) => {
    console.log('\n=== before Exit ==='.toUpperCase())
    console.log('Code: ', code);
    console.log('=== before Exit ==='.toUpperCase())
})
process.on('exit', (code) => {
    console.log('\n=== exit ==='.toUpperCase())
    console.log('Code: ', code)
    console.log('=== exit ==='.toUpperCase())
})
process.on('multipleResolves', (type, promise, reason) => {
    // console.log('\n=== multiple Resolves ==='.toUpperCase())
    // console.log(type, promise, reason)
    // console.log('=== multiple Resolves ==='.toUpperCase())
})