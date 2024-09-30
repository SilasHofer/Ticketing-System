/*
auther:Silas Hofer
 */
"use strict";
const mysql = require("promise-mysql");
const config = require("../config/db/ticket_system.json");

async function createTicket(user_id, category_id, user_name, user_email, title, description) {
    const db = await mysql.createConnection(config);
    let res;

    let sql = `
    CALL add_ticket(?,?,?,?,?,?);`;

    res = await db.query(sql, [user_id, category_id, user_name, user_email, title, description]);

    db.end();
    return res[0][0].ticket_id;
}


module.exports = createTicket;
