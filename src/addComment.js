/*
auther:Silas Hofer
 */
"use strict";
const mysql = require("promise-mysql");
const config = require("../config/db/ticket_system.json");

async function addComment(ticket_id, user_name, text, access) {
    const db = await mysql.createConnection(config);
    let res;

    let sql = `
    CALL add_comment(?,?,?,?);`;

    res = await db.query(sql, [ticket_id, user_name, text, access]);
    db.end();
    return res[0];
}


module.exports = addComment;
