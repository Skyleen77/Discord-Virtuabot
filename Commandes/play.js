const Discord = require('discord.js');
const music = require('@koenie06/discord.js-music');
const Command = require('../Structure/Command');

module.exports = new Command({
    name: "play",
    description: "Permet de jouer une musique",
    utilisation: "[musique]",
    alias: ["play", "playmusic"],
    permission: "Aucune",
    category: "Musique",
    cooldown: 0,

    async run(bot, message, args, db) {

        const song = message.user ? args._hoistedOptions.length >= 1 ? args._hoistedOptions[0].value : undefined : args.join(" ");
        if(!song) return message.reply('Vous devez passer un URL ou un titre de musique en paramètre');

        const channel = message.member.voice.channel;
        if(!channel) return message.reply('Vous devez être dans un channel vocal !');

        try {
            music.play({
                interaction: message,
                channel: channel,
                song: song
            }).catch(err => err);
            message.reply(`Le bot joue \`${song}\``);
        } catch (err) {
            message.reply(`Erreur \`${e}\``);
        }
        
    }
})