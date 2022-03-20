const Discord = require('discord.js');
const moment = require("moment");
const ms = require("ms");
const Command = require('../Structure/Command');

module.exports = new Command({
    name: "giveaway",
    description: "Permet de créer un concours (giveaway)",
    utilisation: "[durée] [gagnants] [channel] [prix]",
    alias: ["giveaway"],
    permission: Discord.Permissions.FLAGS.ADMINISTRATOR,
    category: "Fun",
    cooldown: 0,

    async run(bot, message, args, db) {

        let time = message.user ? args._hoistedOptions[0].value : args[0];
        if(!time) return message.reply("Veuillez indiquer un temps valide !")
        if(isNaN(ms(time))) return message.reply("Veuillez indiquer un temps valide !")

        let winner = message.user ? args._hoistedOptions[1].value : args[1];
        if(!winner) return message.reply("Veuillez indiquer un nombre de gagnant !")
        if(isNaN(winner)) return message.reply("Veuillez indiquer un nombre de gagnant !")

        let channel = message.user ? message.guild.channels.cache.get(args._hoistedOptions[2].value) : message.mentions.channels.first() || message.guild.channels.cache.get(args[2])
        if(!channel) return message.reply("Aucun salon trouvé !")
        if(channel.type !== "GUILD_TEXT") return message.reply("Aucun salon trouvé !")

        let price = message.user ? args._hoistedOptions.length >= 4 ? args._hoistedOptions[3].value : undefined : args.slice(3).join(" ")
        if(!price) return message.reply("Veuillez indiquer un prix !")

        let participants = 0;
        let ID = await bot.function.createID("GIVEAWAY")

        let Embed = new Discord.MessageEmbed()
            .setColor(bot.color)
            .setTitle("Concours")
            .setDescription(`**ID** : \`${ID}\`\n**Prix** : \`${price}\`\n**Gagnant(s)** : \`${winner}\`\n**Date de fin** : \`${moment(Date.now() + ms(time)).locale("FR").format("LLL")}\`\n\n**Nombre de participants** : \`${participants}\``)
            .setTimestamp()
            .setFooter(`${message.user === undefined ? message.author.username : message.user.username}`, message.user === undefined ? message.author.displayAvatarURL({dynamic: true}) : message.user.displayAvatarURL({dynamic: true}))

        const btn = new Discord.MessageActionRow().addComponents(new Discord.MessageButton()
            .setStyle("SUCCESS")
            .setEmoji("🎉")
            .setLabel("Participer au concours / Annuler la participation")
            .setCustomId("participate"))

        let msg = await channel.send({embeds: [Embed], components: [btn]})

        // message.user === undefined ? message.author.id : message.user.id

        let sql = `INSERT INTO giveaway (giveawayID, userID, channelID, messageID, price, winner, date, fini, guildID) VALUES ('${ID}', '${message.user === undefined ? message.author.id : message.user.id}', '${channel.id}', '${msg.id}', '${price.includes("'") ? price.replace(/'/g, "\\'") : price}', '${winner}', '${Date.now() + ms(time)}', 'non', ${message.guild.id})`
        db.query(sql, function(err) {
            if(err) throw err;
        })

        const filter = async() => true;
        const collector = msg.createMessageComponentCollector({filter, time: ms(time)})

        collector.on("collect", async button => {
            
            db.query(`SELECT * FROM participants WHERE ID = '${ID} ${button.user.id}' AND guildID = ${button.guild.id}`, async (err, req) => {

                if(req.length < 1) {

                    await button.reply({content: `Vous participez au concours \`${ID}\` avec succès !`, ephemeral: true})

                    let sql2 = `INSERT INTO participants (ID, giveawayID, userID, guildID) VALUES ('${ID} ${button.user.id}', '${ID}', '${button.user.id}', ${button.guild.id})`
                    db.query(sql2, function(err) {
                        if(err) throw err;
                    })

                    participants = participants + 1;

                    let newEmbed = new Discord.MessageEmbed()
                        .setColor(bot.color)
                        .setTitle("Concours")
                        .setDescription(`**ID** : \`${ID}\`\n**Prix** : \`${price}\`\n**Gagnant(s)** : \`${winner}\`\n**Date de fin** : \`${moment(Date.now() + ms(time)).locale("FR").format("LLL")}\`\n\n**Nombre de participants** : \`${participants}\``)
                        .setTimestamp()
                        .setFooter(`${message.user === undefined ? message.author.username : message.user.username}`, message.user === undefined ? message.author.displayAvatarURL({dynamic: true}) : message.user.displayAvatarURL({dynamic: true}))

                    msg.edit({embeds: [newEmbed]})

                } else {

                    db.query(`DELETE FROM participants WHERE ID = '${ID} ${button.user.id}' AND guildID = ${button.guild.id}`)

                    await button.reply({content: `Vous avez enlevé votre participation au concours \`${ID}\` avec succès !`, ephemeral: true})

                    participants = participants - 1;

                    let newEmbed = new Discord.MessageEmbed()
                        .setColor(bot.color)
                        .setTitle("Concours")
                        .setDescription(`**ID** : \`${ID}\`\n**Prix** : \`${price}\`\n**Gagnant(s)** : \`${winner}\`\n**Date de fin** : \`${moment(Date.now() + ms(time)).locale("FR").format("LLL")}\`\n\n**Nombre de participants** : \`${participants}\``)
                        .setTimestamp()
                        .setFooter(`${message.user === undefined ? message.author.username : message.user.username}`, message.user === undefined ? message.author.displayAvatarURL({dynamic: true}) : message.user.displayAvatarURL({dynamic: true}))

                    msg.edit({embeds: [newEmbed]})
                }
            })

        })

    }
})