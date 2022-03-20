const Discord = require("discord.js");
const Command = require("../Structure/Command");
const { developper } = require('../config');

module.exports = new Command({

    name: "initusers",
    description: "Permet d'ajouter tous les utilisateurs du serveur dans la mémoire du bot",
    utilisation: "",
    alias: ["initusers", "iusers"],
    permission: Discord.Permissions.FLAGS.ADMINISTRATOR,
    category: "Administration",
    cooldown: 10,

    async run(bot, message, args, db) {

        try {

            bot.users.cache.forEach(user => {
            
                if(user.bot === false) {
    
                    db.query(`SELECT * FROM user WHERE userID = ${user.id}`, async (err, req) => {
    
                        if(req.length < 1) {
    
                            let sql = `INSERT INTO user (userID, xp, level, notifications, guildID) VALUES (${user.id}, '0', '0', 'oui', ${message.guild.id})`;
                            db.query(sql, function(err) {
                                if(err) throw err;
                            })
    
                        }
    
                    })
    
                }
            })

            return message.reply('Les utilisateurs ont bien été inclus dans ma mémoire');
            
        } catch (err) {

            return message.reply('Oups, il y a un problème avec cette commande, veuillez contacter le développeur');
            
        }

    }
})