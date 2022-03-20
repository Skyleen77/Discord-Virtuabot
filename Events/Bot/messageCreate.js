const Discord = require('discord.js');
const Event = require('../../Structure/Event');
const { developper } = require('../../config');

const usersSpamMap = new Map();

module.exports = new Event("messageCreate", async (bot, message) => {

    if(message.author.bot) return;
    
    const db = bot.db;

    if (message.channel.type === 'DM') {

        if(message.content === '!stopnotif' || message.content === "!setnotif") {

            let sqlUpdateNotif = `UPDATE user SET notifications = '${message.content === '!stopnotif' ? 'non' : 'oui'}' WHERE userID = ${message.author.id}`;
            db.query(sqlUpdateNotif, function(err) {
                if(err) throw err;
            })

            message.author.send(`Les notifications ont bien été ${message.content === '!stopnotif' ? 'désactivées' : 'activées'} ! Pour les ${message.content === '!stopnotif' ? 'réactivées' : 'désactivées'} envoyez moi \`${message.content === '!stopnotif' ? '!setnotif' : '!stopnotif'}\`en message privé.`);
        
        } else {

            message.author.send(`Je ne gère pas encore mes messages privées. Vous pouvez seulement m'envoyer un \`!setnotif\` ou \`!stopnotif\` pour activer ou désactiver mes notifications.`);

        }

    } else {

        // antispam
        try {

            if(usersSpamMap.has(message.author.id)) {

                const userban = bot.users.cache.get(message.author.id);
    
                const userData = usersSpamMap.get(message.author.id);
                let {msgCount} = userData;
                msgCount += 1;
                userData.msgCount = msgCount;
                usersSpamMap.set(message.author.id, userData);
                if(msgCount >= 5) {
                    message.delete();
                    message.channel.send(`${message.author.tag} le spam est interdit sous peine de bannissement`);
                }
                if(msgCount === 8) {
                    const ID = await bot.function.createID("BAN");
                    const reason = 'Spam';
                    try {
                        await userban.send(`Vous avez été banni du serveur ${message.guild.name} pour la raison ${reason}`);
                    } catch (err) {}
    
                    message.guild.members.cache.get(message.author.id).ban({reason: 'Spam'});
    
                    let sql = `INSERT INTO bans (userID, authorID, banID, guildID, reason, date, time) VALUES (${message.author.id}, '${message.author.id}', '${ID}', '${message.guildId}', '${reason}', '${Date.now()}', 'Défintif')`
                    db.query(sql, function(err) {
                        if(err) throw err;
                    })
    
                    message.channel.send(`${message.author.tag} a été banni pour la raison ${reason}`);
                }
    
            } else {
                usersSpamMap.set(message.author.id, {
                    msgCount: 1
                });
                setTimeout(() => {
                    usersSpamMap.delete(message.author.id);
                }, 10000);
            }
            
        } catch (err) {}
        // antispam


        // MP pub
        try {

            db.query(`SELECT * FROM channelpub`, async (err, req) => {

                if(req.length > 0) {

                    for(let i = 0; i < req.length; i++) {

                        if(message.channelId === req[i].channelID) {
            
                            db.query(`SELECT * FROM user WHERE notifications = 'oui' AND guildID = '${message.guild.id}'`, async (err, req) => {
            
                                for(let i = 0; i < req.length; i++) {
                                    let user = bot.users.cache.get(req[i].userID);
                                    try {

                                        let attachement = "";
                                        message.attachments.forEach(attachment => {
                                            attachement = attachment.attachment;
                                        });

                                        let Embed = new Discord.MessageEmbed()
                                            .setColor(bot.color)
                                            .setTitle("Notification")
                                            .setAuthor(`${message.author.username}`, `${message.author.displayAvatarURL({dynamic: true})}`)
                                            .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
                                            .addFields({ name: `Nouveau message dans le channel ${message.channel.name}`, value: `${message.content}` })
                                            .setImage(attachement)
                                            .setTimestamp()
                                            .setFooter(`Si vous ne souhaitez plus recevoir de notification de ma part, et ainsi ne plus avoir accès au nouveaux contenus et aux nouvelles promotions en premier envoyez moi '!stopnotif' en message privé.`)

                                        await user.send({embeds: [Embed]});
                                        
                                    } catch (err) {}
                                }
            
                            })
            
                        }

                    }

                }
                
            })
        } catch (err) {}
        // MP pub

        try {
            db.query(`SELECT * FROM serveur WHERE guildID = ${message.guild.id}`, async (err, req) => {

                if(req.length < 1) {

                    let sqlServer = `INSERT INTO serveur (guildID, prefix, raid, ownerID, name, icon) VALUES (${message.guild.id}, '!', 'off', ${message.guild.ownerId}, '${message.guild.name}', '${message.guild.icon != null ? message.guild.icon : 'null'}')`;
                    db.query(sqlServer, function(err) {
                        if(err) throw err;
                    })

                    message.guild.channels.cache.forEach(channel => {

                        // if(channel.type != 'GUILD_CATEGORY') {
                        //     let sqlChannels = `INSERT INTO channels (channelID, channelName, guildID) VALUES (${channel.id}, "${channel.name.replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0')}", ${channel.guildId})`;
                        //     db.query(sqlChannels, function(err) {
                        //         if(err) throw err;
                        //     })
                        // }
                        
                    })

                    //initcommandes
                    const commands = bot.commands;
                    commands.forEach(command => {

                        if(command.permission !== 'Développeur') {

                            let sqlCommands = `INSERT INTO commandes (commandName, commandStatut, guildID) VALUES ('${command.name}', 'active', '${message.guild.id}')`;
                            db.query(sqlCommands, function(err) {
                                if(err) throw err;
                            })

                        }        

                    })
                    //initcommandes

                    return message.reply("Attendez que le bot enregistre votre serveur...").then(async msg => {

                        setTimeout(async () => {

                            try {
                                await msg.edit('Serveur enregistré, vous pouvez maintenant utiliser le bot');
                            } catch(err) {
                                await message.editReply('Serveur enregistré, vous pouvez maintenant utiliser le bot');
                            }

                        }, 1000)
                        
                    });

                }

                let prefix = req[0].prefix;

                let messageArray = message.content.split(" ");
                let command = messageArray[0];
                let args = messageArray.slice(1);

                let commandFile = bot.alias.get(command.slice(prefix.length));

                db.query(`SELECT * FROM user WHERE userID = ${message.author.id} AND guildID = ${message.guild.id}`, async (err, req) => {

                    if(req.length < 1) {

                        let sql = `INSERT INTO user (userID, xp, level, notifications, guildID) VALUES (${message.author.id}, '0', '0', 'oui', ${message.guild.id})`;
                        db.query(sql, function(err) {
                            if(err) throw err;
                        })

                        return;
        
                    } else {
        
                        if(!message.content.startsWith(prefix)) {
        
                            let xp = Math.floor(Math.random() * 24) + 1;
                            let need = (parseInt(req[0].level) + 1) * 1000;
        
                            db.query(`UPDATE user SET xp = '${parseInt(req[0].xp) + xp}' WHERE userID = ${message.author.id}`)
        
                            if(parseInt(req[0].xp) >= need) {
        
                                db.query(`UPDATE user SET level = '${parseInt(req[0].level) + 1}' WHERE userID = ${message.author.id}`)
                                db.query(`UPDATE user SET xp = '${parseInt(req[0].xp) - need}' WHERE userID = ${message.author.id}`)
        
                                message.channel.send(`Bravo ${message.author}, tu es passé niveau \`${parseInt(req[0].level) + 1}\``)
                            }
        
                            if(parseInt(req[0].xp) < 0) {
        
                                db.query(`UPDATE user SET level = '${parseInt(req[0].level) - 1}' WHERE userID = ${message.author.id}`)
                                db.query(`UPDATE user SET xp = '${(parseInt(req[0].level) * 1000) + parseInt(req[0].xp)}' WHERE userID = ${message.author.id}`)
        
                                message.channel.send(`Dommage ${message.author}, tu es redescendu niveau \`${parseInt(req[0].level) - 1}\``)
                            }
                        }
                    }

                });

                if(!message.content.startsWith(prefix)) return;
                if(!commandFile) return message.reply(`Cette commande n'existe pas`);

                if(!bot.cooldown.has(commandFile.name)) {
                    bot.cooldown.set(commandFile.name, new Discord.Collection())
                }

                const time = Date.now();
                const cooldown = bot.cooldown.get(commandFile.name);
                const timeCooldown = (commandFile.cooldown || 5) * 1000;

                if(cooldown.has(message.author.id)) {

                    const timeRestant = cooldown.get(message.author.id) + timeCooldown;

                    if(time < timeRestant) {

                        const timeLeft = (timeRestant - time);

                        return message.reply(`Vous devez attendre ` + `\`${(Math.round(timeLeft / (1000 * 60 * 60 * 24) % 30))}\`` + ` jour(s) ` + `\`${(Math.round(timeLeft / (1000 * 60 * 60)))}\`` + ` heure(s) ` + `\`${(Math.round(timeLeft / (1000 * 60) % 60))}\`` + ` minute(s) ` + `\`${(Math.round(timeLeft / 1000 % 60))}\`` + ` seconde(s) pour exécuter cette commande !`)
                    }
                }

                cooldown.set(message.author.id, time);
                setTimeout(() => cooldown.delete(message.author.id), timeCooldown);

                if(commandFile.permission === "Développeur" && message.author.id !== developper) {
                    return message.reply("Vous n'avez pas la permission requise pour excécuter cette commande");
                }

                if(commandFile.permission !== "Aucune" && commandFile.permission !== "Développeur" && !message.member.permissions.has(new Discord.Permissions(commandFile.permission)) && message.author.id !== developper) {
                    return message.reply("Vous n'avez pas la permission requise pour excécuter cette commande");
                }

                //commandset
                db.query(`SELECT * FROM commandes WHERE guildID = ${message.guild.id}`, async (err, req) => {

                    let messageIsValid = true;

                    if(req.length > 0) {

                        req.forEach(com => {

                            if(command.slice(prefix.length) === com.commandName && messageIsValid == true) {

                                if(com.commandStatut === 'desactive') {

                                    message.reply('Cette commande est désactivée');

                                } else {

                                    console.log('ok')

                                    commandFile.run(bot, message, args, db);

                                    messageIsValid = false;

                                }

                            }

                        })

                    }

                })
                //commandset

                
            });
        } catch (err) {}

    }

    
})