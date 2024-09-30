/*
auther:Silas Hofer
 */
"use strict";
const mysql = require("promise-mysql");
const config = require("../config/db/ticket_system.json");

async function addFileToTicket(ticket_id, filename) {
    const db = await mysql.createConnection(config);
    let res;

    let sql = `
    CALL add_file_fo_ticket(?,?);`;

    res = await db.query(sql, [ticket_id, filename]);
    db.end();
    return res[0];
}


module.exports = addFileToTicket;
