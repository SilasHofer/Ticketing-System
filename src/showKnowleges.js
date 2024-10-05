/*
auther:Silas Hofer
 */
"use strict";
const mysql = require("promise-mysql");
const config = require("../config/db/ticket_system.json");

async function showKnowleges(category) {
    const db = await mysql.createConnection(config);
    let res;

    let sql = `
    CALL show_knowleges(?);`;

    res = await db.query(sql, [category]);
    db.end();
    return res[0];
}


module.exports = showKnowleges;
