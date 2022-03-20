const Discord = require("discord.js")
const Event = require("../../Structure/Event")

module.exports = new Event("guildMemberRemove", async (bot, member) => {

    const db = bot.db;

    db.query(`SELECT * FROM user WHERE userID = ${member.user.id}`, async (err, req) => {

        if(req.length < 1) return;

        let sql = `DELETE FROM user WHERE userID = ${member.user.id}`;
        db.query(sql, function(err) {
            if(err) throw err;
        })

    })

})