const Discord = require('discord.js');
const Event = require('../../Structure/Event');
const music = require('@koenie06/discord.js-music');
const { developper } = require('../../config');

module.exports = new Event('addList', async (channel, playlist, requester) => {
    
    channel.send({
        content: `Added the playlist [${playlist.title}](${playlist.url}) with ${playlist.videos.length} amount of videos to the queue.
        Added by ${requester.tag} (${requester.id})`
    });
  
})