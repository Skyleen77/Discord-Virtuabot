const Discord = require("discord.js")
const Event = require("../../Structure/Event");
const { developper } = require('../../config');

module.exports = new Event("interactionCreate", async (bot, interaction) => {

    const db = bot.db;

    try {

        if(interaction.isCommand()) {

            const command = bot.commands.get(interaction.commandName)

            if(!bot.cooldown.has(command.name)) {
                bot.cooldown.set(command.name, new Discord.Collection())
            }

            const time = Date.now();
            const cooldown = bot.cooldown.get(command.name);
            const timeCooldown = (command.cooldown || 5) * 1000;

            if(cooldown.has(interaction.user.id)) {

                const timeRestant = cooldown.get(interaction.user.id) + timeCooldown;

                if(time < timeRestant) {

                    const timeLeft = (timeRestant - time);

                    return interaction.reply(`Vous devez attendre ` + `\`${(Math.round(timeLeft / (1000 * 60 * 60 * 24) % 30))}\`` + ` jour(s) ` + `\`${(Math.round(timeLeft / (1000 * 60 * 60)))}\`` + ` heure(s) ` + `\`${(Math.round(timeLeft / (1000 * 60) % 60))}\`` + ` minute(s) ` + `\`${(Math.round(timeLeft / 1000 % 60))}\`` + ` seconde(s) pour exécuter cette commande !`)
                }
            }

            cooldown.set(interaction.user.id, time);
            setTimeout(() => cooldown.delete(interaction.user.id), timeCooldown);

            if(command.permission === "Développeur" && interaction.user.id !== developper) {
                return interaction.reply("Vous n'avez pas la permission requise pour exécuter cette commande !");
            }

            if(command.permission !== "Aucune" && command.permission !== "Développeur" && !interaction.member.permissions.has(new Discord.Permissions(command.permission)) && interaction.user.id !== developper) {
                return interaction.reply("Vous n'avez pas la permission requise pour exécuter cette commande !");
            }

            //commandset
            try {

                db.query(`SELECT * FROM commandes WHERE guildID = ${interaction.guildId}`, async (err, req) => {

                    if(req.length > 0) {

                        req.forEach(com => {

                            if(command.name === com.commandName) {

                                if(com.commandStatut === 'desactive') {

                                    interaction.reply('Cette commande est désactivée');

                                } else {

                                    command.run(bot, interaction, interaction.options, db);

                                }

                            }

                        })

                    }

                })
                
            } catch (err) {}
            //commandset
        }
        
    } catch (err) {}

    
})