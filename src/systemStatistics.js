/*
auther:Silas Hofer
 */
"use strict";
const mysql = require("promise-mysql");
const config = require("../config/db/ticket_system.json");

async function systemStatistics() {
    const db = await mysql.createConnection(config);
    let res;



    let sql = `
    CALL system_statistics();`;

    res = await db.query(sql, []);
    db.end();
    return res[0][0];
}


module.exports = systemStatistics;
