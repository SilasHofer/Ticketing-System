/*
auther:Silas Hofer
 */
"use strict";
const mysql = require("promise-mysql");
const config = require("../config/db/ticket_system.json");

async function changeNotification(ticket_id, agent_bool, user_bool) {
    const db = await mysql.createConnection(config);
    let res;

    let sql = `
    CALL change_notification(?,?,?);`;

    res = await db.query(sql, [ticket_id, agent_bool, user_bool]);
    db.end();
    return res[0];
}


module.exports = changeNotification;
