const Discord = require('discord.js');
const Command = require('../Structure/Command');

module.exports = new Command({
    name: "channelbienvenue",
    description: "Permet de paramétrer un channel de bienvenue",
    utilisation: "[channelbienvenue] [channelreglement] [action]",
    alias: ["channelbienvenue", "bienvenue", "setbienvenue"],
    permission: Discord.Permissions.FLAGS.ADMINISTRATOR,
    category: "Administration",
    cooldown: 10,

    async run(bot, message, args, db) {

        try {

            let setChannelBienvenue = args[0] || (args._hoistedOptions[0].value);
            let setChannelReglement = args[1] || (args._hoistedOptions[1].value);
            let action = args[2] || (args._hoistedOptions[2].value);

            if(/^<#/.test(setChannelBienvenue) && /^<#/.test(setChannelReglement)) {
                setChannelBienvenue = setChannelBienvenue.slice(2, (setChannelBienvenue.length - 1));
                setChannelReglement = setChannelReglement.slice(2, (setChannelReglement.length - 1));
            }

            if(!setChannelBienvenue || !setChannelReglement) return message.reply("Veuillez indiquer un channel de bienvenue et de règlement")

            db.query(`SELECT * FROM channelbvn WHERE channelName = 'bienvenue'`, async (err, req) => {

                if(action === "add" || action === "ajouter") {
            
                    if(req.length < 1) {

                        let sql = `INSERT INTO channelbvn (channelbonjourID, channelreglementID, channelName, guildID) VALUES ('${setChannelBienvenue}', '${setChannelReglement}', 'bienvenue', ${message.guild.id})`;
                        db.query(sql, function(err) {
                            if(err) throw err;
                        })

                    } 
                    else {

                        let sql = `UPDATE channelbvn SET channelbonjourID = '${setChannelBienvenue}', channelreglementID = '${setChannelReglement}' WHERE channelName = 'bienvenue'`;
                        db.query(sql, function(err) {
                            if(err) throw err;
                        })

                    }

                    return message.reply(`La commande bienvenue à bien été paramétré avec ${message.guild.channels.cache.get(setChannelBienvenue)} comme channel de bienvenue et ${message.guild.channels.cache.get(setChannelReglement)} comme channel de règlement`)
                
                } else if(action === "delete" || action === "del" || action === "supprimer") {

                    if(req.length < 1) {

                        return message.reply(`Le channel de bienvenue n'est pas configuré !`);

                    }

                    let sql = `DELETE FROM channelbvn WHERE channelName = 'bienvenue'`;
                    db.query(sql, function(err) {
                        if(err) throw err;
                    })

                    return message.reply(`Le channel de bienvenue a bien été supprimé`);

                } else {

                    return message.reply("Veuillez indiquer un channel de bienvenue et de règlement et une action (\`add\` ou \`delete\`)");

                }

            })

        } catch (err) {

            return message.reply("Veuillez indiquer un channel de bienvenue et de règlement et une action (add ou delete)");

        }

    }
})