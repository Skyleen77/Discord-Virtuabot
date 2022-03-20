const Discord = require('discord.js');
const Event = require('../../Structure/Event');
const music = require('@koenie06/discord.js-music');
const { developper } = require('../../config');

module.exports = new Event('finish', (channel) => {
    
	channel.send({ content: `All music has been played, disconnecting..` });
  
})