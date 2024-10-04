/*
auther:Silas Hofer
 */
"use strict";
const mysql = require("promise-mysql");
const config = require("../config/db/ticket_system.json");

async function showOldTickets() {
    const db = await mysql.createConnection(config);
    let res;

    let sql = `
    CALL show_old_tickets();`;

    res = await db.query(sql, []);
    db.end();
    return res[0];
}


module.exports = showOldTickets;
