const Discord = require('discord.js');
const Command = require('../Structure/Command');

module.exports = new Command({
    name: "merci",
    description: "Permet de remercier le bot",
    utilisation: "",
    alias: ["merci", "thanks"],
    permission: "Aucune",
    category: "Discussion",
    cooldown: 0,

    async run(bot, message, args, db) {

        message.reply("Pas de problème 😉");

    }
})