/*
auther:Silas Hofer
 */

"use strict";
if (process.env.NODE_ENV != "production") {
    require("dotenv").config()
}
const express = require("express");
const Router = express.Router();
const helpers = require("../src/helpers.js");
const email = require("./mail.js");
const files = require("./files.js");
const auth0 = require("./auth0.js");
const config = require('../config/config.js');

const { auth } = require('express-openid-connect');

Router.use(auth(auth0.authConfig));

const { requiresAuth } = require('express-openid-connect');

Router.get("", requiresAuth(), async (req, res) => {
    let data = {};

    data.title = "Home";
    data.role = req.oidc.user.role[0];
    if (!data.role) {
        res.redirect("/new-user");
    }

    data.name = req.oidc.user.name;
    var userId = req.oidc.user.user_id;
    data.showCategories = await helpers.showCategories();

    try {
        // Fetch tickets depending on the role
        if (data.role != "user") {
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

Router.post("/create-ticket", requiresAuth(), (req, res) => {
    files.upload.array('filename', config.file.max_files)(req, res, function (err) {
        if (err) {
            return res.redirect(`/?error=${encodeURIComponent(err.message)}`);
        }
        const uploadedFiles = req.files.map(file => file.filename);

        (async () => {
            try {
                const ticketId = await helpers.createTicket(req.oidc.user.user_id, req.body.category, req.oidc.user.name, req.oidc.user.email, req.body.title, req.body.description)

                for (const file of uploadedFiles) {
                    await helpers.addFileToTicket(ticketId, file); // Function to insert files related to the ticket
                }


                email.sendEmailToUser(req.oidc.user.email, 'Ticket Created', 'Your ticket ' + req.body.title + ' has been successfully created!')

                res.redirect("/")
            } catch (error) {
                console.error(error);
                res.redirect(`/?error=${encodeURIComponent(error.message)}`);
            }
        })();
    });
});

Router.get("/ticket", requiresAuth(), async (req, res) => {
    let data = {};
    data.ticket = await helpers.getTicket(req.query.ticketID);
    if (!data.ticket || req.oidc.user.role[0] == "user" && req.oidc.user.user_id != data.ticket.creator_id) {
        return res.redirect("/")
    }
    data.role = req.oidc.user.role[0];
    data.title = data.ticket.title;
    data.userId = req.oidc.user.user_id;
    data.userName = req.oidc.user.name;
    data.userEmail = req.oidc.user.email;
    data.showAttachments = await helpers.getAttachments(req.query.ticketID)
    data.showCategories = await helpers.showCategories();
    data.showAttachments.forEach(attachment => {
        attachment.isImage = /\.(jpg|jpeg|png|gif)$/i.test(attachment.file_name);
    });
    if (data.role == "agent" || data.role == "admin") {
        data.showComments = await helpers.showComments(req.query.ticketID, 1);
    } else {
        data.showComments = await helpers.showComments(req.query.ticketID, 0);
    }

    res.render("pages/ticket.ejs", data);
});

Router.get("/claimTicket", requiresAuth(), async (req, res) => {
    await helpers.claimTicket(req.query.ticketID, req.query.userID, req.query.userName, req.query.userEmail);
    await helpers.changeStatus(req.query.ticketID, "Processed");


    res.redirect(`/ticket?ticketID=${req.query.ticketID}`)
});

Router.post("/create-account", requiresAuth(), async (req, res) => {
    try {
        auth0.createAccount(req.body.email, req.body.password, req.body.name, req.body.role);

        res.redirect("/admin-panel")
    } catch (error) {
        console.error(error);
        res.status(500).send('Error making request to Auth0 API');
    }

});

Router.get("/new-user", requiresAuth(), async (req, res) => {
    let data = {};
    data.role = req.oidc.user.role[0];
    data.title = "newUser";
    res.render("pages/new-user.ejs", data);
});

Router.post("/edit-account", requiresAuth(), async (req, res) => {
    await auth0.editAccount(req.oidc.user.user_id, req.body.name, req.body.password)

    res.redirect(`/logout`);

});


Router.get("/changeCategory", requiresAuth(), async (req, res) => {
    await helpers.changeCategory(req.query.category_id, req.query.ticketID);
    res.redirect(`/ticket?ticketID=${req.query.ticketID}`)
});
Router.get("/closeTicket", requiresAuth(), async (req, res) => {
    await helpers.closeTicket(req.query.ticketID);
    email.sendEmailToUser(req.query.creatorEmail, 'Ticket Closed', 'Your ticket ' + req.query.ticketTitle + ' has ben Closed')

    res.redirect(`/ticket?ticketID=${req.query.ticketID}`)
});

Router.get("/changeStatus", requiresAuth(), async (req, res) => {
    email.sendEmailToUser(req.query.creatorEmail, 'Ticket updated', 'Your ticket ' + req.query.ticketTitle + ' has ben updated')
    await helpers.changeStatus(req.query.ticketID, req.query.status);
    res.redirect(`/ticket?ticketID=${req.query.ticketID}`)
});


Router.post("/addComment", requiresAuth(), async (req, res) => {
    let hide;
    if (req.oidc.user.role[0] == "agent" || req.oidc.user.role[0] == "admin") {
        hide = req.body.hide === "on"
    } else {
        hide = false;
    }
    await helpers.addComment(req.body.ticketID, req.body.userName, req.body.comment, hide, req.oidc.user.role[0])
    if (hide == false) {
        email.sendEmailToUser(req.body.creatorEmail, 'Ticket updated', 'Your ticket ' + req.body.ticketTitle + ' has ben updated')
    }

    res.redirect(`/ticket?ticketID=${req.body.ticketID}`)

});

Router.post("/delete-ticket", requiresAuth(), async (req, res) => {
    var userData = await helpers.deleteComment(req.body.ticketID);
    email.sendEmailToUser(userData[0].creator_email, 'Ticket removal', 'Your ticket ' + userData[0].title + ' has ben removed')
    res.redirect("/")
});

Router.get("/admin-panel", requiresAuth(), async (req, res) => {
    let data = {};
    data.title = "Admin Panel";
    data.role = req.oidc.user.role[0];
    data.showCategories = await helpers.showCategories();
    data.accountRequests = await helpers.getRequestedAccounts();
    if (req.oidc.user.role[0] != "admin") {
        return res.redirect("/")
    }

    res.render("pages/admin-panel.ejs", data);
});

Router.get("/accept-account", requiresAuth(), async (req, res) => {
    if (req.oidc.user.role[0] != "admin") {
        return res.redirect("/")
    }
    email.createAccountFromMail(req.query.email);
    helpers.removeAccountRequest(req.query.id)

    res.redirect("/admin-panel")
});

Router.get("/decline-account", requiresAuth(), async (req, res) => {
    if (req.oidc.user.role[0] != "admin") {
        return res.redirect("/")
    }
    email.sendEmailToUser(req.query.email, 'account declined', 'The admin declined your request')
    helpers.removeAccountRequest(req.query.id)

    res.redirect("/admin-panel")
});

Router.post("/add-category", requiresAuth(), async (req, res) => {

    await helpers.addCategory(req.body.category)

    res.redirect("/admin-panel")
});

Router.post("/delete-category", requiresAuth(), async (req, res) => {

    await helpers.deleteCategory(req.body.categoryID)

    res.redirect("/admin-panel")
});



module.exports = Router;
