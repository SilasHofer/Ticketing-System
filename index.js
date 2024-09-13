/*
auther:Silas Hofer
 */

"use strict";

const express = require("express");
const app = express();
const indexRoutes = require("./routes/indexRoutes.js");

const passport = require("passport");
const initializePassport = require("./passport-config.js");
const flash = require("express-flash")
const session = require("express-session");

const port = 3000;
initializePassport(passport)

app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(indexRoutes);

app.listen(port, () => {
    console.log(`Server is on and listening on ${port}`);
});
