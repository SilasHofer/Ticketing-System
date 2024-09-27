/*
auther:Silas Hofer
 */
"use strict";
const mysql = require("promise-mysql");
const config = require("../config/db/ticket_system.json");

async function deleteCategory(category_id) {
    const db = await mysql.createConnection(config);
    let res;

    let sql = `
    CALL delete_category(?);`;

    res = await db.query(sql, [category_id]);
    db.end();
    return res[0];
}


module.exports = deleteCategory;
