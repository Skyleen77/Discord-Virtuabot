const Discord = require('discord.js');
const music = require('@koenie06/discord.js-music');
const Command = require('../Structure/Command');

module.exports = new Command({
    name: "repeat",
    description: "Permet de repéter une musique",
    utilisation: "[action]",
    alias: ["repeat", "repeatmusic"],
    permission: "Aucune",
    category: "Musique",
    cooldown: 0,

    async run(bot, message, args, db) {

        const boolean = message.user ? args._hoistedOptions[0].value : args[0];
        if(!boolean) return message.reply('Vous devez passer \`on\`ou\`off\` en argument');
        if(boolean != 'on') {
            if(boolean != 'off') {
                return message.reply('Vous devez passer \`on\`ou\`off\` en argument');
            }
        }

        const isConnected = await music.isConnected({
            interaction: message
        });
        if(!isConnected) return message.reply({ content: `Aucun son n'est joué`, ephemeral: true });

        const isRepeated = music.isRepeated({
            interaction: message
        }).then(isrepeat => {

            let resp = isrepeat === false ? true : false;

            music.repeat({
                interaction: message,
                value: resp
            });

            message.reply(`La répétition du son est en mode ${boolean}`);

        }).catch(err => err);;

    }
})