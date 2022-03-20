const Discord = require('discord.js');
const Event = require('../../Structure/Event');
const SlashCommand = require("../../Structure/SlashCommand");
const moment = require("moment");

module.exports = new Event("ready", async bot => {

    const db = bot.db;

    await SlashCommand(bot);

    bot.user.setStatus("online");

    setInterval(async () => {

        const activités = ["version Alpha", "l'activité des utilisateurs", "la télévisions", "ses messages privés", `${bot.users.cache.size} utilisateurs`, `${bot.guilds.cache.size} serveurs`];
        const activities = activités[Math.floor(Math.random() * activités.length - 1)];

        bot.user.setActivity(activities, { type: "WATCHING" });

    }, 20000)
    
    console.log(`${bot.user.username} : En ligne sur ${bot.guilds.cache.size} serveur(s)`);

    setInterval(async () => {

        db.query(`SELECT * FROM temp`, async (err, req) => {

            if(req.length < 1) return;

            for(let i = 0; i < req.length; i++) {

                if(Date.now() < parseInt(req[i].time)) return;

                if(req[i].sanctionID.startsWith("BAN")) {

                    try {

                        bot.guilds.cache.get(req[i].guildID).members.unban(req[i].userID)
                        db.query(`DELETE FROM temp WHERE sanctionID = '${req[i].sanctionID}'`)

                    } catch (err) {}
                }
            }
        })

    }, 1000)

    setInterval(async () => {

        db.query(`SELECT * FROM giveaway`, async (err, req) => {

            if(req.length < 1) return;

            for(let i = 0; i < req.length; i++) {

                if(req[i].fini === "non" && parseInt(req[i].date) <= Date.now()) {

                    db.query(`SELECT * FROM participants WHERE giveawayID = '${req[i].giveawayID}'`, async (err, req2) => {

                        let channel = bot.channels.cache.get(req[i].channelID);

                        let msg = await channel.messages.fetch(`${req[i].messageID}`)
                        if(parseInt(req[i].winner) > req2.length) {
                            await db.query(`UPDATE giveaway SET fini = 'oui' WHERE giveawayID = '${req[i].giveawayID}'`)
                            await msg.reply(`Il n'y a pas assez de personnes qui ont participées au concours !`)
                            return;
                        }

                        winner = [];

                        for(let j = 0; j < parseInt(req[i].winner); j++) {

                            let participants = [];
                            for(let k = 0; k < req2.length; k++) {
                                participants.push(req2[k].userID);
                            }

                            let rand = Math.floor(Math.random() * req2.length);
                            let rValue = participants[rand];

                            winner.push(bot.users.cache.get(rValue));

                        }
                        
                        let Embed = new Discord.MessageEmbed()
                            .setColor(bot.color)
                            .setTitle("Concours")
                            .setDescription(`**ID** : \`${req[i].giveawayID}\`\n**Prix** : \`${req[i].price}\`\n**Gagnant(s)** : ${winner.join(" ")}\n**Date de fin** : \`${moment(parseInt(req[i].date)).locale("FR").format("LLL")}\``)
                            .setTimestamp()
                            .setFooter(`${bot.users.cache.get(req[i].userID).username}`, bot.users.cache.get(req[i].userID).displayAvatarURL({dynamic: true}))

                        msg.edit({embeds: [Embed], components: []})
                        msg.reply(`Bravo à ${winner.join(" ")} ! Contactez ${bot.users.cache.get(req[i].userID)} pour recevoir \`${req[i].price}\` !`)
                        await db.query(`UPDATE giveaway SET fini = 'oui' WHERE giveawayID = '${req[i].giveawayID}'`)
                    })
                }
            }
        })

    }, 2000)

})