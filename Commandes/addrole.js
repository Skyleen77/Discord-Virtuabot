const Discord = require('discord.js');
const Command = require('../Structure/Command');

module.exports = new Command({
    name: "addrole",
    description: "Permet d'ajouter ou de mofifier un rôle",
    utilisation: "[rolename] [roleemoji] [rolevalue] [roleid] [roledescription]",
    alias: ["addrole", "setrole"],
    permission: Discord.Permissions.FLAGS.MANAGE_GUILD,
    category: "Administration",
    cooldown: 0,

    async run(bot, message, args, db) {

        if(args.length >= 4 || (args._hoistedOptions && args._hoistedOptions.length >= 4)) {

            try {

                let rolename = message.user ? args._hoistedOptions[0].value : args[0];
                let roleemoji = message.user ? args._hoistedOptions[1].value : args[1];
                let rolevalue = message.user ? args._hoistedOptions[2].value : args[2];
                let roleid = message.user ? args._hoistedOptions[3].value : args[3];
                let roledescription = message.user ? args._hoistedOptions.length >= 5 ? args._hoistedOptions[4].value : undefined : args.slice(4).join(" ");

                if(roledescription.includes("'")) roledescription = roledescription.replace(/'/g, "\\'")

                if(/^<@&/.test(roleid)) {
                    roleid = roleid.slice(3, (roleid.length - 1));
                }

                db.query(`SELECT * FROM roles WHERE roleValue = '${rolevalue}' AND guildID = ${message.guild.id}`, async (err, req) => {

                    if(req.length < 1) {

                        let sql = `INSERT INTO roles (roleName, roleEmoji, roleValue, roleID, roleDescription, guildID) VALUES ('${rolename}', '${roleemoji}', '${rolevalue}', '${roleid}', '${roledescription}', ${message.guild.id})`;
                        db.query(sql, function(err) {
                            if(err) throw err;
                        })

                        return message.reply(`Le rôle ${rolename} a bien été créé !`);
                    
                    } else {

                        let sql = `UPDATE roles SET roleName = '${rolename}', roleEmoji = '${roleemoji}', roleID = '${roleid}', roleDescription = '${roledescription}' WHERE roleValue = '${rolevalue}' AND guildID = ${message.guild.id}`;
                        db.query(sql, function(err) {
                            if(err) throw err;
                        })

                        return message.reply(`Le rôle avec la valeur ${rolevalue} a bien mis à jours !`);

                    }
                
                });
        
            } catch(err) {

                return message.reply(`Veillez saisir le nom du rôle, l'emoji, la valeur (un mot UNIQUE représentant le rôle), le ping du rôle`);
                
            }

        } else {

            return message.reply(`Veillez saisir le nom du rôle, l'emoji, la valeur (un mot UNIQUE représentant le rôle), le ping du rôle`);

        } 

    }
})