/*
auther:Silas Hofer
 */
"use strict";
const mysql = require("promise-mysql");
const config = require("../config/db/ticket_system.json");

async function createAccountRequest(email) {
    const db = await mysql.createConnection(config);
    let res;

    let sql = `
    CALL create_account_request(?);`;

    res = await db.query(sql, [email]);

    db.end();
    return res[0];
}


module.exports = createAccountRequest;
