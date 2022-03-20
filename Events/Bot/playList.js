const Discord = require('discord.js');
const Event = require('../../Structure/Event');
const music = require('@koenie06/discord.js-music');
const { developper } = require('../../config');

module.exports = new Event('playList', async (channel, playlist, songInfo, requester) => {
    
    channel.send({
        content: `Started playing the song [${songInfo.title}](${songInfo.url}) by \`${songInfo.author}\` of the playlist ${playlist.title}.
        This was requested by ${requester.tag} (${requester.id})`
    });
  
})