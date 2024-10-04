/*
auther:Silas Hofer
 */
"use strict";
const mysql = require("promise-mysql");
const config = require("../config/db/ticket_system.json");

async function removeAccountRequest(id) {
    const db = await mysql.createConnection(config);
    let res;

    let sql = `
    CALL remove_account_request(?);`;

    res = await db.query(sql, [id]);

    db.end();
    return res[0];
}


module.exports = removeAccountRequest;
