const Discord = require('discord.js');
const Event = require('../../Structure/Event');
const music = require('@koenie06/discord.js-music');
const { developper } = require('../../config');

module.exports = new Event('addSong', (channel, songInfo, requester) => {
	    
    channel.send({ content: `Added the song [${songInfo.title}](${songInfo.url}) - ${songInfo.duration} to the queue | Added by \`${requester.tag}\`` });
  
})