const Discord = require('discord.js');
const Command = require('../Structure/Command');

module.exports = new Command({
    name: "random",
    description: "Permet de sélectionner un utilisateur aléatoirement",
    utilisation: "[user1] [user2] (user3) ... (userN)",
    alias: ["random", "randomuser", "tirage"],
    permission: Discord.Permissions.FLAGS.ADMINISTRATOR,
    category: "Fun",
    cooldown: 0,

    async run(bot, message, args, db) {

        if(args.length > 2) {

            let users = [];

            for(let i = 0; i < args.length; i++) {

                let user = message.user ? args._hoistedOptions[i].value : args[i];
                users.push(user);

            }

            let rand = Math.floor(Math.random() * users.length);
            let rValue = users[rand];

            return message.reply(`La personne tirée au sort est ${rValue}`);

        } else {

            return message.reply(`Oupss.. je ne peux pas effectuer le tirage au sort... Avez-vous bien ping (@) au moins deux participants ?`);

        }

    }
})