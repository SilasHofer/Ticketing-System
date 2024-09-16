/*
auther:Silas Hofer
 */
"use strict";
const mysql = require("promise-mysql");
const config = require("../config/db/ticket_system.json");

async function createTicket(id, title, description) {
    const db = await mysql.createConnection(config);
    let res;

    let sql = `
    CALL add_ticket(?,?,?);`;

    res = await db.query(sql, [id, title, description]);
    db.end();
    return res[0];
}


module.exports = createTicket;
