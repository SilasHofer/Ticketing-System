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

Router.get("", requiresAuth(), (req, res) => {
    let data = {};
    data.title = "login";
    data.role = req.oidc.user.role[0]
    data.name = req.oidc.user.name
    res.render("pages/index.ejs", data);
});





module.exports = Router;
