const mysql = require('mysql');
const Database = new mysql.createConnection({
    host: "45.90.163.125",
    user: "root",
    password: "Beyblade77",
    database: "virtuabot",
    charset : "utf8mb4"
})

Database.connect(function(err) {
    if(err) throw err;

    console.log("La base de données à été connecté avec succès !")
})

module.exports = Database;