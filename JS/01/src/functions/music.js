const { SpotifyTrack, SpotifyAlbum, SpotifyPlaylist, SpotifyArtist } = require('@liliaclient1/spotify')
const { splitBar } = require('string-progressbar') 

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

function msToTime(duration) {
    let seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
  
    hours = (hours < 10) ? "0" + hours : hours
    minutes = (minutes < 10) ? "0" + minutes : minutes
    seconds = (seconds < 10) ? "0" + seconds : seconds
  
    return hours + ":" + minutes + ":" + seconds
}

function progressbar(total, current, size) {
    return splitBar(total, current, size = size, line = '▬', slider = '🔘')[0]
}

function player_events(client, message, player) {
    
}

module.exports = {
    getTracks,
    msToTime,
    progressbar,
    player_events
}