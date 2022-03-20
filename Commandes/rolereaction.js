const Discord = require('discord.js');
const Command = require('../Structure/Command');

module.exports = new Command({
    name: "rolereaction",
    description: "Permet de configurer un menu déroulant permettant de mettre de selectionner ses rôles (n'existe pas en / commande)",
    utilisation: "[channelmessage] [role1] ... (roleN)",
    alias: ["rolereaction", "addrolereation"],
    permission: Discord.Permissions.FLAGS.ADMINISTRATOR,
    category: "Administration",
    cooldown: 0,

    async run(bot, message, args, db) {

        try {

            let setChannelMessage = args[0];
            if(!setChannelMessage) return message.reply(`Veuillez selectionner un channel (#) pour poster le message et au minimum le ping (@) d'un rôle`)

            if(/^<#/.test(setChannelMessage)) {
                setChannelMessage = setChannelMessage.slice(2, (setChannelMessage.length - 1));

                let rolesid = "";
                for(let i = 1; i < (args.length); i++) {

                    let roleid = message.user ? args._hoistedOptions[i].value : args[i];

                    if(/^<@&/.test(roleid)) {
                        roleid = roleid.slice(3, (roleid.length - 1));
                    }

                    rolesid += ` roleID = '${roleid}'`;

                    if(i !== (args.length - 1)) {
                        rolesid += ` OR`;
                    }

                }

                let Embed = new Discord.MessageEmbed()
                    .setColor(bot.color)
                    .setTitle("Rôles")
                    .setThumbnail(bot.user.displayAvatarURL({dynamic: true}))
                    .setDescription("Veuillez choisir les rôles que vous voulez dans le menu déroulant ci-dessous.")
                    .setTimestamp()
                    .setFooter(`${bot.user.username}`, bot.user.displayAvatarURL({dynamic: true}))

                
                let sql = `SELECT * FROM roles WHERE${rolesid} AND guildID = ${message.guild.id}`;
                
                db.query(sql, async (err, req) => {

                    if(req.length === (args.length - 1)) {

                        let roles = [];
                        for(let i = 0; i < req.length; i++) {
            
                            let role = {label: `${req[i].roleName}`, description: `${req[i].roleDescription}`, emoji: `${req[i].roleEmoji}`, value: `${req[i].roleValue}`}

                            roles.push(role);
            
                        }

                        const menu = new Discord.MessageActionRow().addComponents(new Discord.MessageSelectMenu()
                            .setCustomId("menu")
                            .setMinValues(0)
                            .setMaxValues(req.length)
                            .setPlaceholder("Faites un choix !")
                            .addOptions(roles))


                        let channel = bot.channels.cache.get(setChannelMessage);

                        let msg = await channel.send({embeds: [Embed], components: [menu]});

                        const filter = async() => true;
                        const collector = msg.createMessageComponentCollector({filter});

                        // console.log(message.guild);
                        let rolesbot = [];
                        message.guild.me.roles.cache.forEach(thebot => {
                            rolesbot.push(thebot.position);
                        });
                        let rolebotposition = Math.max(...rolesbot);

                        collector.on("collect", async menu => {

                            for(let i = 0; i < req.length; i++) {

                                let therole = channel.guild.roles.cache.get(req[i].roleID);

                                for(let j = 0; j < menu.values.length; j++) {

                                    if(menu.values[j] === req[i].roleValue) {

                                        if(therole.position < rolebotposition) {
                                            menu.member.roles.add(therole.id);
                                        } else {
                                            return message.reply('Le bot ne peut pas mettre un rôle positionné au dessus du sien');
                                        }
                                        
                                    }

                                }

                                if(menu.member.roles.cache.has(therole.id) && !menu.values.includes(`${req[i].roleValue}`)) menu.member.roles.remove(therole.id)

                            }
                            
                            menu.reply({content: "Vos rôles ont été modifiés !", ephemeral: true})
                        })
                        

                    } else {

                        return message.reply(`Veillez à bien ajouter tous les roles un par un dans ma mémoire avec la commande \`addrole\`, à bien sélectionner un channel de publications et les différents rôles. Veillez à ce que tous les arguments soient bien séparées par un espace !`);

                    }

                })
            
            } else {

                message.reply('Veuillez préciser un channel (#) !');

            }
            
        } catch (err) {

            message.reply('Il y a un problème dans la commande...');
            
        }

    }
})