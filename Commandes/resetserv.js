const Discord = require('discord.js');
const Command = require('../Structure/Command');

module.exports = new Command({
    name: "resetserv",
    description: "Permet de reinitialiser les données du serveur dans la mémoire du bot",
    utilisation: "",
    alias: ["resetserv"],
    permission: "Développeur",
    category: "Développement",
    cooldown: 10,

    async run(bot, message, args, db) {

        let sqlServ = `DELETE FROM serveur WHERE guildID = ${message.guild.id}`;
        db.query(sqlServ, function(err) {
            if(err) throw err;
        })

        let sqlChannel = `DELETE FROM channels WHERE guildID = ${message.guild.id}`;
        db.query(sqlChannel, function(err) {
            if(err) throw err;
        })

        let sqlCommand = `DELETE FROM commandes WHERE guildID = ${message.guild.id}`;
        db.query(sqlCommand, function(err) {
            if(err) throw err;
        })

        message.reply('Les données du serveurs ont bien été réinitiallisées');

    }
})