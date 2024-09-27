/*
auther:Silas Hofer
 */
"use strict";
const mysql = require("promise-mysql");
const config = require("../config/db/ticket_system.json");

async function addCategory(category_name) {
    const db = await mysql.createConnection(config);
    let res;

    let sql = `
    CALL add_category(?);`;

    res = await db.query(sql, [category_name]);
    db.end();
    return res[0];
}


module.exports = addCategory;
