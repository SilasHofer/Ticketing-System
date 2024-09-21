/*
auther:Silas Hofer
 */
"use strict";
const mysql = require("promise-mysql");
const config = require("../config/db/ticket_system.json");

async function closeTicket(ticket_id) {
    const db = await mysql.createConnection(config);
    let res;

    let sql = `
    CALL close_ticket(?);`;

    res = await db.query(sql, [ticket_id]);
    db.end();
    return res[0];
}


module.exports = closeTicket;
