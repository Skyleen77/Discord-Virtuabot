const Discord = require('discord.js');
const music = require('@koenie06/discord.js-music');
const Command = require('../Structure/Command');

module.exports = new Command({
    name: "stopmusic",
    description: "Permet de stopper la musique",
    utilisation: "",
    alias: ["stopmusic"],
    permission: "Aucune",
    category: "Musique",
    cooldown: 0,

    async run(bot, message, args, db) {

        try {
            music.stop({ interaction: message }).catch(err => err);
            message.reply('Musique arrêté')
        } catch (err) {
            message.reply(`Erreur \`${e}\``);
        }
        
    }
})