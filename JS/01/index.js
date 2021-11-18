const Cluster = require('discord-hybrid-sharding')
const config = require("./config")

const manager = new Cluster.Manager(__dirname + "/src/client.js", {
    totalShards: config.totalClusters * 2,
    totalClusters: config.totalClusters,
    mode: "process",
    token: config.token,
    usev13: true
})

manager.on('clusterCreate', cluster => {
    console.log(`Launched Cluster ${cluster.id}`)
})

manager.spawn(undefined, -1, -1)