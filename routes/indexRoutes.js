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
    data.role = req.oidc.user.role[0];
    data.title = "Home";

    data.fileSettings = config.file;


    data.name = req.oidc.user.name;
    data.userId = req.oidc.user.sub;
    data.showCategories = await helpers.showCategories();

    try {
        // Fetch tickets depending on the role
        if (data.role != "user") {
            data.showTickets = await helpers.showTickets("");
        } else {
            data.showTickets = await helpers.showTickets(data.userId);
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
                const ticketId = await helpers.createTicket(req.oidc.user.sub, req.body.category, req.oidc.user.name, req.oidc.user.email, req.body.title, req.body.description)

                for (const file of uploadedFiles) {
                    await helpers.addFileToTicket(ticketId, file); // Function to insert files related to the ticket
                }


                email.sendEmailToUser(req.oidc.user.email, `Ticket Created TicketID:${ticketId}`, 'Your ticket ' + req.body.title + ' has been successfully created!\nYou can reply to add a comment on the ticket Or send CLOSE/SOLVED to change the ticket status')

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
    if (!data.ticket || req.oidc.user.role[0] == "user" && req.oidc.user.sub != data.ticket.creator_id) {
        return res.redirect("/")
    }
    data.role = req.oidc.user.role[0];
    if (data.ticket.agent_notification == 1 && data.role != "user") {
        helpers.changeNotification(data.ticket.idTickets, 0, 0);
    }
    if (data.ticket.user_notification == 1 && data.role == "user") {
        helpers.changeNotification(data.ticket.idTickets, 0, 0);
    }
    if (data.role != "user") {
        data.agents = await auth0.getAgentUsers();
    }
    data.availableStatuses = config.status.ticketStatuses;
    data.title = data.ticket.title;
    data.userId = req.oidc.user.sub;
    data.userName = req.oidc.user.name;
    data.userEmail = req.oidc.user.email;
    data.showAttachments = await helpers.getAttachments(req.query.ticketID)
    data.showCategories = await helpers.showCategories();
    data.showAttachments.forEach(attachment => {
        attachment.isImage = /\.(jpg|jpeg|png|gif)$/i.test(attachment.file_name);
    });
    if (data.role == "agent" || data.role == "admin") {
        data.showComments = await helpers.showComments(req.query.ticketID, 1);
        data.showKnowleges = await helpers.showKnowleges(data.ticket.category_id);
    } else {
        data.showComments = await helpers.showComments(req.query.ticketID, 0);
    }

    res.render("pages/ticket.ejs", data);
});

Router.get("/claimTicket", requiresAuth(), async (req, res) => {
    await helpers.assignAgent(req.query.ticketID, req.query.userID, req.query.userName, req.query.userEmail);
    await helpers.changeStatus(req.query.ticketID, config.status.ticketStatuses[1]);
    email.sendEmailToUser(req.query.creatorEmail, `Ticket updated TicketID:${req.query.ticketID}`, ` ${req.query.userName} has claimed your Ticket.\nYou can reply to add a comment on the ticket Or send CLOSE/SOLVED to change the ticket status`)

    res.redirect(`/ticket?ticketID=${req.query.ticketID}`)
});

Router.get("/assignAgent", requiresAuth(), async (req, res) => {
    const { ticketID, agentInfo } = req.query;

    // agentInfo will be in the format "userID,userName,userEmail"
    const [userId, userName, userEmail, creatorEmail] = agentInfo.split(',');

    await helpers.assignAgent(ticketID, userId, userName, userEmail);
    await helpers.changeStatus(ticketID, config.status.ticketStatuses[1]);
    email.sendEmailToUser(creatorEmail, `Ticket updated TicketID:${req.query.ticketID}`, ` ${userName} has been assigned to your Ticket.\n You can reply to add a comment on the ticket Or send CLOSE/SOLVED to change the ticket status `)
    res.redirect(`/ticket?ticketID=${ticketID}`)
});

Router.post("/create-account", requiresAuth(), async (req, res) => {
    try {
        const users = await auth0.getAllUsers()
        if (req.body.password != req.body.confirm_password) {
            return res.redirect("/panel?error=passwords_do_not_match")
        }
        if (users.some(user => user.email.toLowerCase() === req.body.email.toLowerCase())) {
            return res.redirect("/panel?error=account_already_exists")
        }
        auth0.createAccount(req.body.email, req.body.password, req.body.name, req.body.role);

        res.redirect("/panel")
    } catch (error) {
        console.error(error);
        res.status(500).send('Error making request to Auth0 API');
    }

});
Router.get("/change-profile-picture", requiresAuth(), async (req, res) => {
    auth0.changeProfilePicture(req.oidc.user.sub, res.query.newProfilePictureUrl)

    res.redirect("/account-setting");
});

Router.get("/account-setting", requiresAuth(), async (req, res) => {

    let data = {};
    data.role = req.oidc.user.role[0];
    data.niceRole = data.role.charAt(0).toUpperCase() + data.role.slice(1);
    data.user = await auth0.getUser(req.oidc.user.sub);;
    data.error = req.query.error ? req.query.error.replace(/_/g, ' ') : null;
    data.successPassword = req.query.successPassword ? req.query.successPassword.replace(/_/g, ' ') : null;
    data.successName = req.query.successName ? req.query.successName.replace(/_/g, ' ') : null;


    data.title = "Account Setting"
    res.render("pages/account-setting.ejs", data);
});

Router.post("/change-password", requiresAuth(), async (req, res) => {
    if (req.body.newPassword != req.body.confirmPassword) {
        return res.redirect("/account-setting?error=passwords_do_not_match")
    }
    await auth0.changeAccountPassword(req.body.userID, req.body.newPassword);

    res.redirect('/account-setting?successPassword=passwords_changed');
});

Router.post("/change-name", requiresAuth(), async (req, res) => {
    await auth0.changeAccountName(req.body.userID, req.body.newName);
    res.redirect('/account-setting?successName=Name_changed');
});

Router.get("/knowledge-base", requiresAuth(), async (req, res) => {
    let data = {};
    data.role = req.oidc.user.role[0];
    data.showKnowleges = await helpers.showKnowleges(null);
    data.showCategories = await helpers.showCategories();

    data.title = "Knowledge Base"
    res.render("pages/knowledge-base.ejs", data);
});

Router.post("/addKnowledge", requiresAuth(), async (req, res) => {

    await helpers.addKnowledge(req.body.title, req.body.description, req.body.category, req.oidc.user.name)
    const referer = req.get('Referer'); // Get the Referer header
    res.redirect(referer || '/');

});


Router.get("/changeCategory", requiresAuth(), async (req, res) => {
    email.sendEmailToUser(req.query.creatorEmail, `Ticket updated TicketID:${req.query.ticketID}`, `The Category for your ticket  ${req.query.ticketTitle}  has ben changed to ${req.query.categoryName}\n You can reply to add a comment on the ticket Or send CLOSE/SOLVED to change the ticket status`)
    await helpers.changeCategory(req.query.category_id, req.query.ticketID);
    res.redirect(`/ticket?ticketID=${req.query.ticketID}`)
});

Router.get("/closeTicket", requiresAuth(), async (req, res) => {
    await helpers.changeStatus(req.query.ticketID, "Closed");
    email.sendEmailToUser(req.query.creatorEmail, 'Ticket Closed', 'Your ticket ' + req.query.ticketTitle + ' has ben Closed')

    res.redirect(`/ticket?ticketID=${req.query.ticketID}`)
});

Router.get("/solveTicket", requiresAuth(), async (req, res) => {
    await helpers.changeStatus(req.query.ticketID, "Solved");
    email.sendEmailToUser(req.query.creatorEmail, 'Ticket Closed', 'Your ticket ' + req.query.ticketTitle + ' has ben Solved')

    res.redirect(`/ticket?ticketID=${req.query.ticketID}`)
});



Router.get("/changeStatus", requiresAuth(), async (req, res) => {
    email.sendEmailToUser(req.query.creatorEmail, `Ticket updated TicketID:${req.query.ticketID}`, `The Status for your ticket  ${req.query.ticketTitle}  has ben changed to ${req.query.status}\n You can reply to add a comment on the ticket Or send CLOSE/SOLVED to change the ticket status`)
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
    const ticketJson = req.body.ticket;

    // Parse the JSON string back into an object
    const ticket = JSON.parse(ticketJson);
    if (ticket.agent_notification != 1 && req.oidc.user.role[0] == "user") {
        helpers.changeNotification(ticket.idTickets, 1, 0);
    }
    if (ticket.user_notification != 1 && req.oidc.user.role[0] != "user") {
        helpers.changeNotification(ticket.idTickets, 0, 1);
    }
    await helpers.addComment(ticket.idTickets, req.body.userName, req.body.comment, hide, req.oidc.user.role[0])
    if (hide == false && req.oidc.user.role[0] != "user") {
        email.sendEmailToUser(ticket.creator_email, `Ticket updated TicketID:${ticket.idTickets}`, `Your ticket ${ticket.title} has ben updated\n Comment: ${req.body.comment}\n You can reply to add a comment on the ticket Or send CLOSE/SOLVED to change the ticket status`)
    }

    res.redirect(`/ticket?ticketID=${ticket.idTickets}`)

});

Router.post("/delete-ticket", requiresAuth(), async (req, res) => {
    var userData = await helpers.deleteComment(req.body.ticketID);
    email.sendEmailToUser(userData[0].creator_email, 'Ticket removal', 'Your ticket ' + userData[0].title + ' has ben removed')
    res.redirect("/")
});

Router.get("/panel", requiresAuth(), async (req, res) => {
    let data = {};
    data.role = req.oidc.user.role[0];
    if (data.role == "admin") {
        data.title = "Admin Panel";
    } else {
        data.title = "Agent Panel";
    }
    data.error = req.query.error ? req.query.error.replace(/_/g, ' ') : null;
    data.userId = req.oidc.user.sub;
    data.statistics = await helpers.systemStatistics();
    data.showCategories = await helpers.showCategories();
    data.accountRequests = await helpers.getRequestedAccounts();
    data.showOldTickets = await helpers.showOldTickets();
    data.showUsers = await auth0.getAllUsers();
    data.roleID = config.role;
    if (data.role != "admin" && data.role != "agent") {
        return res.redirect("/")
    }

    res.render("pages/panel.ejs", data);
});

Router.get("/accept-account", requiresAuth(), async (req, res) => {
    if (req.oidc.user.role[0] != "admin") {
        return res.redirect("/")
    }
    email.createAccountFromMail(req.query.email);
    helpers.removeAccountRequest(req.query.id)

    res.redirect("/panel")
});

Router.get("/decline-account", requiresAuth(), async (req, res) => {
    if (req.oidc.user.role[0] != "admin") {
        return res.redirect("/")
    }
    email.sendEmailToUser(req.query.email, 'account declined', 'The admin declined your request')
    helpers.removeAccountRequest(req.query.id)

    res.redirect("/panel")
});

Router.post("/add-category", requiresAuth(), async (req, res) => {

    await helpers.addCategory(req.body.category)

    res.redirect("/panel")
});

Router.post("/delete-category", requiresAuth(), async (req, res) => {

    await helpers.deleteCategory(req.body.categoryID)

    res.redirect("/panel")
});

Router.post("/delete-user", requiresAuth(), async (req, res) => {

    await auth0.deleteUser(req.body.userID)

    res.redirect("/panel")
});



module.exports = Router;
