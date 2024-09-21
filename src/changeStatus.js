/*
auther:Silas Hofer
 */
"use strict";
const mysql = require("promise-mysql");
const config = require("../config/db/ticket_system.json");

async function changeStatus(ticket_id, status) {
    const db = await mysql.createConnection(config);
    let res;

    let sql = `
    CALL change_status(?,?);`;

    res = await db.query(sql, [ticket_id, status]);
    db.end();
    return res[0];
}


module.exports = changeStatus;
