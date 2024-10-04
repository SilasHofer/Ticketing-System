/*
auther:Silas Hofer
 */
"use strict";
const mysql = require("promise-mysql");
const config = require("../config/db/ticket_system.json");

async function getRequestedAccounts() {
    const db = await mysql.createConnection(config);
    let res;

    let sql = `
    CALL get_requested_accounts();`;

    res = await db.query(sql, []);

    db.end();
    return res[0];
}


module.exports = getRequestedAccounts;
