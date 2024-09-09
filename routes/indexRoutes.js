/*
auther:Silas Hofer
 */

"use strict";

const express = require("express");
const Router = express.Router();


Router.get("", (req, res) => {
    let data = {};

    data.title = "start";
    res.render("pages/index.ejs", data);
});



module.exports = Router;
