const Discord = require('discord.js');
const music = require('@koenie06/discord.js-music');
const Command = require('../Structure/Command');

module.exports = new Command({
    name: "removequeue",
    description: "Permet de supprimer une musique dans la file",
    utilisation: "[position]",
    alias: ["removequeue", "rqueue"],
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

        const queue = await music.getQueue({
            interaction: message
        });
        if(!queue[number - 1]) return message.reply({ content: `Ce numéro n'existe pas dans la file d'attente`, ephemeral: true });

        music.removeQueue({
            interaction: message,
            number: number
        });
        message.reply({ content: `Musique n°${number} de la file d'attente supprimée` });

    }
})