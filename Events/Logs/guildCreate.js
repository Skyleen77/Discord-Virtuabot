const Event = require("../../Structure/Event");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { token } = require("../../config");

module.exports = new Event("guildCreate", async (bot, guild) => {
    
    const commands = [

        new SlashCommandBuilder()
            .setName("ping")
            .setDescription("Permet de connaître la latence du bot"),

        new SlashCommandBuilder()
            .setName("prefix")
            .setDescription("Permet de changer le préfixe du bot")
            .addStringOption(option => option.setName("préfixe").setDescription("Le préfixe que le bot doit avoir").setRequired(true)),

        new SlashCommandBuilder()
            .setName("clear")
            .setDescription("Permet de supprimer un nombre de messages")
            .addStringOption(option => option.setName("nombre").setDescription("Le nombre de messages a effacer").setRequired(true)),

        new SlashCommandBuilder()
            .setName("rank")
            .setDescription("Permet de connaître l'expérience d'un utilisateur")
            .addUserOption(option => option.setName("membre").setDescription("Le membre en question").setRequired(false)),

        new SlashCommandBuilder()
            .setName("leaderboard")
            .setDescription("Permet de connaître le classement des utilisateurs par expérience"),

        new SlashCommandBuilder()
            .setName("ban")
            .setDescription("Permet de bannir définitivement un utilisateur")
            .addUserOption(option => option.setName("membre").setDescription("Le membre à bannir").setRequired(true))
            .addStringOption(option => option.setName("raison").setDescription("La raison du bannissement").setRequired(false)),

        new SlashCommandBuilder()
            .setName("kick")
            .setDescription("Permet d'expulser un utilisateur")
            .addUserOption(option => option.setName("membre").setDescription("Le membre à expulser").setRequired(true))
            .addStringOption(option => option.setName("raison").setDescription("La raison de l'expulsion").setRequired(false)),

        new SlashCommandBuilder()
            .setName("restart")
            .setDescription("Permet de redémarrer le bot"),

        new SlashCommandBuilder()
            .setName("stop")
            .setDescription("Permet de stopper le bot"),

        new SlashCommandBuilder()
            .setName("eval")
            .setDescription("Permet d'évaluer un code")
            .addStringOption(option => option.setName("code").setDescription("Le code à évaluer").setRequired(true)),

        new SlashCommandBuilder()
            .setName("reload")
            .setDescription("Permet de recharger une commande")
            .addStringOption(option => option.setName("commande").setDescription("La commande à recharger").setRequired(true)),

        new SlashCommandBuilder()
            .setName("help")
            .setDescription("Permet de connaître toutes les commandes du bot ou la description d'une commande")
            .addStringOption(option => option.setName("commande").setDescription("La commande en question").setRequired(false)),

        new SlashCommandBuilder()
            .setName("warn")
            .setDescription("Permet d'avertir un utilisateur")
            .addUserOption(option => option.setName("membre").setDescription("Le membre à avertir").setRequired(true))
            .addStringOption(option => option.setName("raison").setDescription("La raison de l'avertissement").setRequired(false)),

        new SlashCommandBuilder()
            .setName("antiraid")
            .setDescription("Permet d'activer ou de désactiver l'anti-raid")
            .addStringOption(option => option.setName("état").setDescription("État de l'anti-raid").setRequired(true)),

        new SlashCommandBuilder()
            .setName("channelbienvenue")
            .setDescription("Permet de paramètrer un channel de bienvenue")
            .addChannelOption(option => option.setName("channelbonjour").setDescription("Le channel de message de bienvenue").setRequired(true))
            .addChannelOption(option => option.setName("channelreglement").setDescription("Le channel de règlement").setRequired(true))
            .addStringOption(option => option.setName("action").setDescription("L'action (add ou delete)").setRequired(true)),

        new SlashCommandBuilder()
            .setName("merci")
            .setDescription("Permet de remercier le bot"),

        new SlashCommandBuilder()
            .setName("tempban")
            .setDescription("Permet de bannir temporairement un utilisateur")
            .addUserOption(option => option.setName("membre").setDescription("Le membre à bannir").setRequired(true))
            .addStringOption(option => option.setName("temps").setDescription("La durée du bannissement").setRequired(true))
            .addStringOption(option => option.setName("raison").setDescription("La raison du bannissement").setRequired(false)),
        
        new SlashCommandBuilder()
            .setName("unban")
            .setDescription("Permet de débannir un utilisateur")
            .addStringOption(option => option.setName("membre").setDescription("Le membre à débannir").setRequired(true))
            .addStringOption(option => option.setName("raison").setDescription("La raison du débannissement").setRequired(false)),

        new SlashCommandBuilder()
            .setName("addrole")
            .setDescription("Permet d'ajouter ou de mofifier un rôle")
            .addStringOption(option => option.setName("rolename").setDescription("Le nom du rôle").setRequired(true))
            .addStringOption(option => option.setName("roleemoji").setDescription("L'emoji du rôle").setRequired(true))
            .addStringOption(option => option.setName("rolevalue").setDescription("La valeur du rôle (un mot UNIQUE servant d'identifiant de rôle)").setRequired(true))
            .addRoleOption(option => option.setName("roleid").setDescription("Le ping (@) du rôle").setRequired(true))
            .addStringOption(option => option.setName("roledescription").setDescription("La courte description du rôle").setRequired(true)),

        new SlashCommandBuilder()
            .setName("channelpub")
            .setDescription("Permet de paramètrer un channel de pub")
            .addChannelOption(option => option.setName("channel").setDescription("Le channel de pub").setRequired(true))
            .addStringOption(option => option.setName("action").setDescription("L'action (add ou delete)").setRequired(true)),

        new SlashCommandBuilder()
            .setName("initusers")
            .setDescription("Permet d'ajouter tous les utilisateurs du serveur dans la mémoire du bot"),

        new SlashCommandBuilder()
            .setName("resetserv")
            .setDescription("Permet de reinitialiser les données du serveur dans la mémoire du bot"),

        new SlashCommandBuilder()
            .setName("activecommand")
            .setDescription("Permet d'activer une commande")
            .addStringOption(option => option.setName("commande").setDescription("La commande à activer").setRequired(true)),

        new SlashCommandBuilder()
            .setName("desactivecommand")
            .setDescription("Permet de desactiver une commande")
            .addStringOption(option => option.setName("commande").setDescription("La commande à desactiver").setRequired(true)),

        new SlashCommandBuilder()
            .setName("giveaway")
            .setDescription("Permet de créer un concours (giveaway)")
            .addStringOption(option => option.setName("durée").setDescription("La durée du giveaway (ex: 10s)").setRequired(true))
            .addStringOption(option => option.setName("gagnants").setDescription("Le nombre de gagnants du giveaway").setRequired(true))
            .addChannelOption(option => option.setName("channel").setDescription("Le channel dans lequel sera publié le giveaway").setRequired(true))
            .addStringOption(option => option.setName("prix").setDescription("Le prix à gagner lors du giveaway").setRequired(true)),

        new SlashCommandBuilder()
            .setName("play")
            .setDescription("Permet de lancer une musique")
            .addStringOption(option => option.setName("musique").setDescription("URL ou titre").setRequired(true)),

        new SlashCommandBuilder()
            .setName("pause")
            .setDescription("Permet de mettre en pause la musique"),

        new SlashCommandBuilder()
            .setName("stopmusic")
            .setDescription("Permet d'arrêter la musique"),

        new SlashCommandBuilder()
            .setName("skip")
            .setDescription("Permet de passer à la musique suivante dans la file d'attente"),

        new SlashCommandBuilder()
            .setName("resume")
            .setDescription("Permet de reprendre une musique en pause"),

        new SlashCommandBuilder()
            .setName("repeat")
            .setDescription("Permet de répéter la musique en cours")
            .addStringOption(option => option.setName("action").setDescription("on ou off").setRequired(true)),

        new SlashCommandBuilder()
            .setName("removequeue")
            .setDescription("Permet de supprimer une musique précise de la file d'attente")
            .addStringOption(option => option.setName("position").setDescription("Position de la musique dans la file").setRequired(true)),
            
        new SlashCommandBuilder()
            .setName("jump")
            .setDescription("Permet d'écouter une musique précise dans la file")
            .addStringOption(option => option.setName("position").setDescription("Position de la musique dans la file").setRequired(true)),

        new SlashCommandBuilder()
            .setName("getqueue")
            .setDescription("Permet connaître les musiques en file d'attente")
            
    ]
      
    const rest = new REST({ version: '9' }).setToken(token);

    await rest.put(Routes.applicationGuildCommands(bot.user.id, guild.id), { body: commands });

})