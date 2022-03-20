const Discord = require('discord.js');
const Event = require('../../Structure/Event');
const music = require('@koenie06/discord.js-music');
const { developper } = require('../../config');

module.exports = new Event('playSong', (channel, songInfo, requester) => {
	    
        channel.send({ content: `Started playing the song [${songInfo.title}](${songInfo.url}) - ${songInfo.duration} | Requested by \`${requester.tag}\`` })
  
})