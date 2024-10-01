/*
auther:Silas Hofer
 */
"use strict";
const mysql = require("promise-mysql");
const config = require("../config/db/ticket_system.json");

async function changeCategory(category_id, ticket_id) {
    const db = await mysql.createConnection(config);
    let res;

    let sql = `
    CALL change_category(?,?);`;

    res = await db.query(sql, [category_id, ticket_id]);
    db.end();
    return res[0];
}


module.exports = changeCategory;
