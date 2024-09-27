/*
auther:Silas Hofer
 */
"use strict";
const mysql = require("promise-mysql");
const config = require("../config/db/ticket_system.json");

async function showCategories() {
    const db = await mysql.createConnection(config);
    let res;

    let sql = `
    CALL show_categories();`;

    res = await db.query(sql, []);
    db.end();
    return res[0];
}


module.exports = showCategories;
