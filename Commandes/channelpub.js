const Discord = require('discord.js');
const Command = require('../Structure/Command');

module.exports = new Command({
    name: "channelpub",
    description: "Permet d'ajouter ou supprimer un channel de pub MP",
    utilisation: "[channel] [action]",
    alias: ["channelpub", "setchannelpub", "addchannelpub"],
    permission: Discord.Permissions.FLAGS.MANAGE_GUILD,
    category: "Administration",
    cooldown: 0,

    async run(bot, message, args, db) {

        try {

            let channel = message.user ? args._hoistedOptions[0].value : args[0];
            if(/^<#/.test(channel) && /^<#/.test(channel)) {
                channel = channel.slice(2, (channel.length - 1));
            }

            let action = message.user ? args._hoistedOptions[1].value : args[1];

            let channelSend = bot.channels.cache.get(channel);

            db.query(`SELECT * FROM channelpub WHERE channelID = ${channel}`, async (err, req) => {

                if(action === "add" || action === "ajouter") {

                    if(req.length < 1) {

                        let sql = `INSERT INTO channelpub (channelID, channelName, guildID) VALUES (${channel}, '${channelSend.name}', ${message.guild.id})`;
                        db.query(sql, function(err) {
                            if(err) throw err;
                        })
        
                        return message.reply('Le channel de pub à bien été ajouté');                    

                    }
                    
                    return message.reply('Le channel de pub à déjà été ajouté');

                } else if(action === "delete" || action === "del" || action === "supprimer") {

                    let sql = `DELETE FROM channelpub WHERE channelID = ${channel}`;
                    db.query(sql, function(err) {
                        if(err) throw err;
                    })
    
                    return message.reply('Le channel de pub à bien été supprimé');

                } else {

                    return message.reply(`La commande channelpub doit être suivie du channel puis de l'action (\`add\` ou \`delete\`)`);

                }
    
            })
            
        } catch (err) {

            message.reply('Il y a un problème dans la commande...');
            
        }

    }
})