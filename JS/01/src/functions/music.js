const { SpotifyTrack, SpotifyAlbum, SpotifyPlaylist, SpotifyArtist } = require('@liliaclient1/spotify')

async function getTracks(manager, player, word) {
    const YT = word.match(/^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi)
    if (player.manager.spotify.isSpotifyUrl(word)) {
        const item = await player.manager.spotify.load(word)
        if (item instanceof SpotifyTrack) {
            const track = await item.resolveLavalinkTrack()
            return [track]
        } else if (item instanceof SpotifyAlbum) {
            const track = await item.resolveAllTracks()
            return track
        } else if (item instanceof SpotifyPlaylist) {
            const track = await item.resolveAllTracks()
            return track
        } else if (item instanceof SpotifyArtist) {
            const track = await item.resolveAllTracks()
            return track
        } else {
            return 'ERROR_MUSIC_NOT_FOUND_OK_NAJA';
        }
    } else if (YT !== null) {
        var results = await manager.search(`${YT}`);
        if (results.tracks.length < 1) return 'ERROR_MUSIC_NOT_FOUND_OK_NAJA'
        return results.tracks
    } else {
        var results = await manager.search(`ytsearch:${word}`);
        if (results.tracks.length < 1) return 'ERROR_MUSIC_NOT_FOUND_OK_NAJA'
        return [results.tracks[0]]
    }
}

function player_events(client, message, player) {
    
}

module.exports = {
    getTracks,
    player_events
}