/*
auther:Silas Hofer
 */
"use strict";
const mysql = require("promise-mysql");
const config = require("../config/db/ticket_system.json");

async function registration(first_name, last_name, email, hashedPassword) {
    const db = await mysql.createConnection(config);
    let res;

    let sql = `
    CALL registration(?,?,?,?);`;

    res = await db.query(sql, [first_name, last_name, email, hashedPassword]);
    db.end();
    return res[0];
}


module.exports = registration;
