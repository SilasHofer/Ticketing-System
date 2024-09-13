/*
auther:Silas Hofer
 */

"use strict";
if (process.env.NODE_ENV != "production") {
    require("dotenv").config()
}
const express = require("express");
const passport = require("passport");
const Router = express.Router();
const bcrypt = require("bcrypt");

const helpers = require("../src/helpers.js");

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next(); // User is authenticated, proceed to the next middleware
    }
    // User is not authenticated, redirect to login
    res.redirect("/");
}


Router.get("", (req, res) => {
    let data = {};

    data.title = "login";
    res.render("pages/index.ejs", data);
});

Router.get("/registration", (req, res) => {
    let data = {};

    data.title = "registration";
    res.render("pages/registration.ejs", data);
});

Router.post("/registration", async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await helpers.registration(req.body.first_name, req.body.last_name, req.body.email, hashedPassword)
    res.redirect("/")
});

Router.get("/gg", ensureAuthenticated, (req, res) => {
    let data = {};
    data.name = req.user[0].first_name + req.user[0].last_name
    data.title = "gg";

    res.render("pages/gg.ejs", data);
});


Router.post("/login", passport.authenticate("local", {
    successRedirect: "/gg",
    failureRedirect: "/",
    failureFlash: true
}));

module.exports = Router;
