const Discord = require('discord.js');
const Command = require('../Structure/Command');

module.exports = new Command({
    name: "desactivecommand",
    description: "Permet de desactiver une commande",
    utilisation: "[commande]",
    alias: ["desactivecommand"],
    permission: Discord.Permissions.FLAGS.ADMINISTRATOR,
    category: "Administration",
    cooldown: 0,

    async run(bot, message, args, db) {

        try {

            let command = args[0] || (args._hoistedOptions[0].value);

            if(/^\//.test(command) || /^!/.test(command)) {
                command = command.slice(1);
            }

            db.query(`SELECT * FROM commandes WHERE guildID = ${message.guild.id}`, async (err, req) => {

                if(req.length > 0) {

                    req.forEach(com => {

                        if(command === com.commandName) {

                            let sql = `UPDATE commandes SET commandStatut = 'desactive' WHERE commandName = '${command}' AND guildID = ${message.guild.id}`;
                            db.query(sql, function(err) {
                                if(err) throw err;
                            })

                            return message.reply(`La commande \`${command}\` a bien été desactivée !`);

                        }

                    })

                }

            })
            

        } catch (err) {

            return message.reply("Veuillez indiquer la commande à desactiver");

        }

    }
})