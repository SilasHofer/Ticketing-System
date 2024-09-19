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
const nodemailer = require('nodemailer');
const helpers = require("../src/helpers.js");
const userCache = new Map();

const { auth } = require('express-openid-connect');

let transporter = nodemailer.createTransport({
    service: 'gmail', // You can use any provider like 'yahoo', 'hotmail', 'outlook', etc.
    auth: {
        user: process.env.source_email,   // The email to send from
        pass: process.env.source_email_password     // The email password or app-specific password
    }
});

function sendEmailToUser(req, transporter, emailText) {
    // Define mail options
    const mailOptions = {
        from: 'ticketsystem8@gmail.com',
        to: req.oidc.user.email,
        subject: 'Ticket Created',
        text: emailText
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            //console.error('Error:', error);
            return false;
        }
        console.log('Email sent:', info.response);
        return true;
    });
}

async function getUserInformation(userId) {
    if (userCache.has(userId)) {
        return userCache.get(userId);
    }
    const axios = require("axios").default;

    const options = {
        method: 'GET',
        url: `https://dev-c3i3d0lsnjh0p61t.eu.auth0.com/api/v2/users/${userId}`,
        headers: {
            Authorization: `Bearer ${process.env.AUTH0_ACCESS_TOKEN}`
        }
    };

    try {
        const response = await axios.request(options);
        userCache.set(userId, response.data);
        return response.data; // Return the data directly
    } catch (error) {
        console.error('Error fetching user information:', error);
        throw error; // Propagate the error so the caller can handle it
    }
}


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
    data.role = req.oidc.user.role[0];
    data.name = req.oidc.user.name;
    var userId = req.oidc.user.user_id;

    try {
        // Fetch tickets depending on the role
        if (data.role == "agent") {
            data.showTickets = await helpers.showTickets("");
        } else {
            data.showTickets = await helpers.showTickets(userId);
        }

        // Render the page
        res.render("pages/index.ejs", data);

    } catch (error) {
        console.error('Error fetching tickets or user data:', error);
        res.status(500).send('Error loading tickets');
    }
});

Router.post("/create-ticket", requiresAuth(), async (req, res) => {
    await helpers.createTicket(req.oidc.user.user_id, req.oidc.user.name, req.oidc.user.email, req.body.title, req.body.description)

    sendEmailToUser(req, transporter, 'Your ticket ' + req.body.title + ' has been successfully created!')

    res.redirect("/")
});

Router.get("/ticket", requiresAuth(), async (req, res) => {
    let data = {};
    data.ticket = await helpers.getTicket(req.query.ticketID);
    data.role = req.oidc.user.role[0];
    data.title = data.ticket.title;
    data.userId = req.oidc.user.user_id;
    data.userName = req.oidc.user.name;
    data.userEmail = req.oidc.user.email;

    if (req.oidc.user.role[0] != "agent" && req.oidc.user.user_id != data.ticket.creator_id) {
        res.redirect("/")
    }

    res.render("pages/ticket.ejs", data);
});

Router.get("/claimTicket", requiresAuth(), async (req, res) => {
    console.log(req.query.ticketID, req.query.userID, req.query.userName, req.query.userEmail)
    await helpers.claimTicket(req.query.ticketID, req.query.userID, req.query.userName, req.query.userEmail);
    res.redirect(`/ticket?ticketID=${req.query.ticketID}`)
});




module.exports = Router;
