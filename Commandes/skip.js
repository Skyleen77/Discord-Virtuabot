const Discord = require('discord.js');
const music = require('@koenie06/discord.js-music');
const Command = require('../Structure/Command');

module.exports = new Command({
    name: "skip",
    description: "Permet de passer à la musique suivante",
    utilisation: "[nombre]",
    alias: ["skip", "skipmusic"],
    permission: "Aucune",
    category: "Musique",
    cooldown: 0,

    async run(bot, message, args, db) {

        const isConnected = await music.isConnected({
            interaction: message
        });
        if(!isConnected) return message.reply({ content: `Aucun son n'est joué`, ephemeral: true });

        const queue = music.getQueue({
            interaction: message
        }).then(len => {

            if(len.length <= 1) return message.reply({ content: `Il n'y a plus de musique après !`, ephemeral: true });

            music.skip({
                interaction: message
            });

            message.reply({ content: `Musique suivante` });

        }).catch(err => err);

    }
})