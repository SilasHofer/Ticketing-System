/*
auther:Silas Hofer
 */
"use strict";
const mysql = require("promise-mysql");
const config = require("../config/db/ticket_system.json");

async function assignAgent(ticket_id, agent_id, agent_name, agent_email) {
    const db = await mysql.createConnection(config);
    let res;

    let sql = `
    CALL claim_ticket(?,?,?,?);`;

    res = await db.query(sql, [ticket_id, agent_id, agent_name, agent_email]);
    db.end();
    return res[0];
}


module.exports = assignAgent;
