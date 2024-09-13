/*
auther:Silas Hofer
 */
"use strict";
const mysql = require("promise-mysql");
const config = require("../config/db/ticket_system.json");

async function user_by_email(email) {
    const db = await mysql.createConnection(config);
    let res;

    let sql = `
    CALL user_by_email(?);`;

    res = await db.query(sql, [email]);
    db.end();
    return res[0];
}


module.exports = user_by_email;
