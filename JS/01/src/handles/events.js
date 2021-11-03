module.exports = function handles_events(client) {
    let all_events_status = []
    require("../events").forEach(e => {
        if (e.name && e.run) {
            client.on(e.name, e.run.bind(null, client))
            all_events_status.push(new event_status(client.cluster.id, e.name, "ready"))
        } else all_events_status.push(new event_status(client.cluster.id, e.name, "not_ready"))
    })
    console.table(all_events_status)
}

class event_status {
    constructor(cluster_id, event_name, status) {
        this.cluster_id = cluster_id
        this.event_name = event_name,
        this.status = status
    }
}