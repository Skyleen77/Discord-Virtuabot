const Discord = require("discord.js")
const Event = require("../../Structure/Event")

module.exports = new Event("guildMemberAdd", async (bot, member) => {


    const db = bot.db;

    db.query(`SELECT * FROM serveur WHERE guildID = ${member.guild.id}`, async (err, req) => {

        if(req.length < 1) return;

        if(req[0].raid === "on") {

            try {
                await member.user.send("Ce serveur est en mode anti-raid !");
            } catch (err) {}

            await member.kick("Mode anti-raid activé");
        }

        db.query(`SELECT * FROM user WHERE userID = ${member.user.id}`, async (err, req2) => {

            if(req2.length > 0) return;

            let sql = `INSERT INTO user (userID, xp, level, notifications, guildID) VALUES (${member.user.id}, '0', '0', 'oui', '${member.guild.id}')`
            db.query(sql, function(err) {
                if(err) throw err;
            })

        })

        db.query(`SELECT * FROM channelbvn WHERE channelName = 'bienvenue'`, async (err, req3) => {

            if(req3.length < 1) return;

            for(let i = 0; i < req3.length; i++) {

                const channel = member.guild.channels.cache.get(req3[i].channelbonjourID);
    
                if (!channel) return;

                let descOffBvn = '';

                let descriptionBvn = '';
                
                if(req3[i].channelMessage) {
                    descriptionBvn = `${req3[i].channelMessage}`;

                    let testUser = descriptionBvn.split("/@");

                    for(let i = 0; i < testUser.length; i++) {
                        if(testUser[i] == 'user') {
                            testUser[i] = member.user;
                        }
                    }

                    let newDescBvn = testUser.join('');

                    let testChannel = newDescBvn.split("/#");

                    for(let i = 0; i < testChannel.length; i++) {
                        if(member.guild.channels.cache.get(testChannel[i])) {
                            testChannel[i] = member.guild.channels.cache.get(testChannel[i]);
                        }
                    }

                    descOffBvn = testChannel.join('');
                } else {
                    descOffBvn = `Bonjour et bienvenue ${member.user} sur le serveur, pense à lire le ${member.guild.channels.cache.get(req3[i].channelreglementID)}`;
                }
            
                const embed = new Discord.MessageEmbed();
            
                embed
                    .setTitle("Nouveau membre !")
                    .setColor(bot.color)
                    .setAuthor(member.user.tag)
                    .setThumbnail(member.user.avatarURL({ dynamic: true }))
                    .setDescription(descOffBvn)
                    .setTimestamp(member.joinedTimestamp);
            
                channel.send({ embeds: [embed] });

            }

            

        })
        
    })
})