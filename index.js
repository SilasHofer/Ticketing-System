/*
auther:Silas Hofer
 */

"use strict";

const express = require("express");

const config = require('./config/config.js');
const app = express();
const indexRoutes = require("./routes/indexRoutes.js");
const path = require('path');



app.use(express.urlencoded({ extended: false }));


app.set("view engine", "ejs");

app.use(express.static("public"));
app.use('/config', express.static("config"));



app.use(indexRoutes);

app.listen(config.app.port, () => {
    console.log(`Server is on and listening on ${config.app.port}`);
});
