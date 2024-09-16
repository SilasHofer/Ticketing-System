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

const { auth } = require('express-openid-connect');

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH_SECRET,
    baseURL: 'http://localhost:3000',
    clientID: process.env.AUTH_CLIENTID,
    issuerBaseURL: process.env.AUTH_ISSUERBASEURL
};
Router.use(auth(config));

const { requiresAuth } = require('express-openid-connect');

Router.get("", requiresAuth(), async (req, res) => {
    let data = {};
    data.title = "Home";
    data.role = req.oidc.user.role[0]
    data.name = req.oidc.user.name
    if (data.role == "agent") {
        data.showTickets = await helpers.showTickets("");
    } else {
        data.showTickets = await helpers.showTickets(req.oidc.user.user_id);
    }
    console.log(data.showTickets)
    res.render("pages/index.ejs", data);
});

Router.post("/create-ticket", requiresAuth(), async (req, res) => {
    await helpers.createTicket(req.oidc.user.user_id, req.body.title, req.body.description)
    res.redirect("/")
});





module.exports = Router;
