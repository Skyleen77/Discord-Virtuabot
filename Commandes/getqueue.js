const Discord = require('discord.js');
const music = require('@koenie06/discord.js-music');
const Command = require('../Structure/Command');

module.exports = new Command({
    name: "queue",
    description: "Permet de connaître les musiques dans la file",
    utilisation: "",
    alias: ["queue", "getqueue"],
    permission: "Aucune",
    category: "Musique",
    cooldown: 0,

    async run(bot, message, args, db) {

        const isConnected = await music.isConnected({
            interaction: message
        });
        if(!isConnected) return message.reply({ content: `Aucun son n'est joué`, ephemeral: true });
        
        const queue = await music.getQueue({
            interaction: message
        }).catch(err => err);
        
        let response = ``;
        
        for (let i = 0; i < queue.length; i++) {
            response += `${i + 1}. [${queue[i].info.title}](${queue[i].info.url}) - ${queue[i].info.duration}\n`
        };
        
        message.reply({ content: response });

    }
})