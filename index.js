/*
auther:Silas Hofer
 */

"use strict";

const express = require("express");
const app = express();
const indexRoutes = require("./routes/indexRoutes.js");

const port = 1337;

app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

app.use(indexRoutes);

app.listen(port, () => {
    console.log(`Server is on and listening on ${port}`);
});
