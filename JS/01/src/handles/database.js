const { createConnection } = require('mysql')

module.exports = (client) => {
    client.mysql = createConnection(client.config.self_database)
    client.datacore = createConnection(client.config.core_database)
    connect_to_database(client)
}

function connect_to_database(client) {
    client.mysql.connect((err) => {
        if (err) {
            console.log(`[cluster ${client.cluster.id}] [self_db] can't connect to database.`, err)
            setTimeout(connect_to_database(client), 3000)
        }
        console.log(`[cluster ${client.cluster.id}] [self_db] connect to database finish!`)
    })
    client.datacore.connect((err) => {
        if (err) {
            console.log(`[cluster ${client.cluster.id}] [core_db] can't connect to database.`, err)
            setTimeout(connect_to_database(client), 3000)
        }
        console.log(`[cluster ${client.cluster.id}] [core_db] connect to database finish!`)
    })
    client.mysql.on("error", (err) => {
        console.log(`[cluster ${client.cluster.id}] [self_db] database error.`, err)
        setTimeout(connect_to_database(client), 3000)
    })
    client.datacore.on("error", (err) => {
        console.log(`[cluster ${client.cluster.id}] [core_db] database error.`, err)
        setTimeout(connect_to_database(client), 3000)
    })
}