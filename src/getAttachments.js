/*
auther:Silas Hofer
 */
"use strict";
const mysql = require("promise-mysql");
const config = require("../config/db/ticket_system.json");

async function getAttachments(ticket_id) {
    const db = await mysql.createConnection(config);
    let res;

    let sql = `
    CALL get_attachments(?);`;

    res = await db.query(sql, [ticket_id]);
    db.end();
    return res[0];
}


module.exports = getAttachments;
