/*
auther:Silas Hofer
 */
"use strict";
const mysql = require("promise-mysql");
const config = require("../config/db/ticket_system.json");

async function showComments(id, access) {
    const db = await mysql.createConnection(config);
    let res;

    let sql = `
    CALL show_comments(?,?);`;

    res = await db.query(sql, [parseInt(id), access]);
    db.end();
    return res[0];
}


module.exports = showComments;
