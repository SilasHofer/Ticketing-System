/*
auther:Silas Hofer
 */
"use strict";
const mysql = require("promise-mysql");
const config = require("../config/db/ticket_system.json");

async function addKnowledge(title, description, category_id, user_id) {
    const db = await mysql.createConnection(config);
    let res;

    let sql = `
    CALL add_knowledge(?,?,?,?);`;

    res = await db.query(sql, [title, description, category_id, user_id]);
    db.end();
    return res[0];
}


module.exports = addKnowledge;
