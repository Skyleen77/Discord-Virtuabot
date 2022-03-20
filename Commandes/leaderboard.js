const Discord = require('discord.js');
const Canvas = require('discord-canvas-easy');
const Command = require('../Structure/Command');

module.exports = new Command({
    name: "leaderboard",
    description: "Permet de connaître le classement des 10 utilisateurs qui ont le plus d'expérience",
    utilisation: "",
    alias: ["leaderboard", "ranking", "top", "classement"],
    permission: "Aucune",
    category: "Experience",
    cooldown: 5,

    async run(bot, message, args, db) {

        await message.reply("En cours...").then(async msg => {

            db.query(`SELECT * FROM user WHERE guildID = ${message.guild.id}`, async (err, req) => {
                
                if(req.length > 0) {

                    const Leaderboard = await new Canvas.Leaderboard()
                        .setBot(bot)
                        .setGuild(message.guild)
                        .setColorFont("#ffffff")
                        .setBackground("./img/background2.png")

                    if(req.length < 10) {

                        for(let i = 0; i < req.length; i++) {

                            Leaderboard.addUser(bot.users.cache.get(req[i].userID), parseInt(req[i].level), parseInt(req[i].xp), ((parseInt(req[i].level) + 1) * 1000));

                        }

                    } else {

                        for(let i = 0; i < 10; i++) {

                            Leaderboard.addUser(bot.users.cache.get(req[i].userID), parseInt(req[i].level), parseInt(req[i].xp), ((parseInt(req[i].level) + 1) * 1000));

                        }

                    }

                    const leaderboard = (await Leaderboard.toLeaderboard()).toBuffer()

                    const attachment = new Discord.MessageAttachment(leaderboard, 'leaderboard.png')

                    try {
                        msg.edit({content: null, files: [attachment]})
                    } catch (err) {
                        message.editReply({content: null, files: [attachment]})
                    }

                } else {

                    try {
                        msg.edit('Utilisateurs introuvables !')
                    } catch (err) {
                        message.editReply('Utilisateurs introuvables !')
                    }

                }

            })
        
        })

    }
})