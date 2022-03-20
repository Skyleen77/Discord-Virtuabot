const Discord = require('discord.js');
const music = require('@koenie06/discord.js-music');
const Command = require('../Structure/Command');

module.exports = new Command({
    name: "pause",
    description: "Permet de mettre en pause la musique",
    utilisation: "",
    alias: ["pause", "pausemusic"],
    permission: "Aucune",
    category: "Musique",
    cooldown: 0,

    async run(bot, message, args, db) {

        const isConnected = await music.isConnected({
            interaction: message
        });
        if(!isConnected) return message.reply({ content: `Aucun son n'est joué`, ephemeral: true });

        const isPaused = music.isPaused({
            interaction: message
        }).then(ispause => {
            
            if(ispause == true) return message.reply({ content: 'Le son est déjà en pause', ephemeral: true });

            music.pause({
                interaction: message
            });

            message.reply(`Musique mise en pause`);

        }).catch(err => err);;

    }
})