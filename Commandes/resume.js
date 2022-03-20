const Discord = require('discord.js');
const music = require('@koenie06/discord.js-music');
const Command = require('../Structure/Command');

module.exports = new Command({
    name: "resume",
    description: "Permet de reprendre la musique",
    utilisation: "",
    alias: ["resume", "resumemusic"],
    permission: "Aucune",
    category: "Musique",
    cooldown: 0,

    async run(bot, message, args, db) {

        const isConnected = await music.isConnected({
            interaction: message
        });
        if(!isConnected) return message.reply({ content: `Aucun son n'est joué`, ephemeral: true });

        const isResumed = music.isResumed({
            interaction: message
        }).then(isresume => {
            
            if(isresume == true) return message.reply({ content: 'Le son a déjà repis', ephemeral: true });

            music.resume({
                interaction: message
            }).catch(e => message.reply(`${e}`));

            message.reply(`Musique reprise`);

        }).catch(err => err);;
        
    }
})