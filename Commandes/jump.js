const Discord = require('discord.js');
const music = require('@koenie06/discord.js-music');
const Command = require('../Structure/Command');

module.exports = new Command({
    name: "jump",
    description: "Permet d'aller à une musique précise dans la file",
    utilisation: "[position]",
    alias: ["jump", "jumpmusic"],
    permission: "Aucune",
    category: "Musique",
    cooldown: 0,

    async run(bot, message, args, db) {

        const number = parseInt(message.user ? args._hoistedOptions[0].value : args[0]);
        if(!number) return message.reply('Vous devez passer un nombre en argument');
        if(isNaN(number)) return message.reply(`Vous devez passer un nombre en argument`);

        const isConnected = await music.isConnected({
            interaction: message
        });
        if(!isConnected) return message.reply({ content: `Aucun son n'est joué`, ephemeral: true });

        const queue = music.getQueue({
            interaction: message
        }).then(len => {

            if(number >= len.length) return message.reply({ content: 'Je ne peux pas aller plus loin !', ephemeral: true });

            music.jump({
                interaction: message,
                number: number
            });

        }).catch(err => err);

    }
})