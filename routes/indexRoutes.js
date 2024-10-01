/*
auther:Silas Hofer
 */

"use strict";
if (process.env.NODE_ENV != "production") {
    require("dotenv").config()
}
const express = require("express");
const Router = express.Router();
const nodemailer = require('nodemailer');
const helpers = require("../src/helpers.js");
const multer = require('multer');
const config = require('../config/config.js');
const path = require('path');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/user_files/'); // Directory where files will be saved
    },
    filename: (req, file, cb) => {
        // Use the original file name, but you can also add a timestamp or a unique ID
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const originalName = file.originalname.replace(path.extname(file.originalname), ''); // Get the original name without extension
        const extension = path.extname(file.originalname); // Get the extension
        cb(null, `${originalName}-${uniqueSuffix}${extension}`); // Retain original name and add unique suffix
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: config.file.max_file_size * 1024 * 1024, files: config.file.max_files }, // 2 MB file size limit
    fileFilter: (req, file, cb) => {

        const isMimeTypeAllowed = config.file.allowed_mime_types.includes(file.mimetype);
        const isExtensionAllowed = config.file.allowed_extensions.some(type => type === path.extname(file.originalname).toLowerCase());

        if (isMimeTypeAllowed && isExtensionAllowed) {
            cb(null, true);
        } else {
            cb(new Error('File type not allowed!'), false);
        }
    }
});


const { auth } = require('express-openid-connect');

let transporter = nodemailer.createTransport({
    service: 'gmail', // You can use any provider like 'yahoo', 'hotmail', 'outlook', etc.
    auth: {
        user: process.env.source_email,   // The email to send from
        pass: process.env.source_email_password     // The email password or app-specific password
    }
});

function sendEmailToUser(req, transporter, to, emailsubject, emailText) {
    // Define mail options
    const mailOptions = {
        from: 'ticketsystem8@gmail.com',
        to: to,
        subject: emailsubject,
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

const authConfig = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH_SECRET,
    baseURL: 'http://localhost:3000',
    clientID: process.env.AUTH_CLIENTID,
    issuerBaseURL: process.env.AUTH_ISSUERBASEURL
};
Router.use(auth(authConfig));

const { requiresAuth } = require('express-openid-connect');

Router.get("", requiresAuth(), async (req, res) => {
    let data = {};
    if (req.query.error) {

    }
    data.title = "Home";
    data.role = req.oidc.user.role[0];
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
    upload.array('filename', config.file.max_files)(req, res, function (err) {
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


                //sendEmailToUser(req, transporter, req.oidc.user.email, 'Ticket Created', 'Your ticket ' + req.body.title + ' has been successfully created!')

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
    res.redirect(`/ticket?ticketID=${req.query.ticketID}`)
});

Router.get("/changeCategory", requiresAuth(), async (req, res) => {
    await helpers.changeCategory(req.query.category_id, req.query.ticketID);
    res.redirect(`/ticket?ticketID=${req.query.ticketID}`)
});
Router.get("/closeTicket", requiresAuth(), async (req, res) => {
    await helpers.closeTicket(req.query.ticketID);
    //sendEmailToUser(req, transporter, req.query.creatorEmail, 'Ticket Closed', 'Your ticket ' + req.query.ticketTitle + ' has ben Closed')

    res.redirect(`/ticket?ticketID=${req.query.ticketID}`)
});

Router.get("/changeStatus", requiresAuth(), async (req, res) => {
    //sendEmailToUser(req, transporter, req.query.creatorEmail, 'Ticket updated', 'Your ticket ' + req.query.ticketTitle + ' has ben updated')
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
        //sendEmailToUser(req, transporter, req.body.creatorEmail, 'Ticket updated', 'Your ticket ' + req.body.ticketTitle + ' has ben updated')
    }

    res.redirect(`/ticket?ticketID=${req.body.ticketID}`)

});

Router.post("/delete-ticket", requiresAuth(), async (req, res) => {
    var userData = await helpers.deleteComment(req.body.ticketID);
    //sendEmailToUser(req, transporter, userData[0].creator_email, 'Ticket removal', 'Your ticket ' + userData[0].title + ' has ben removed')
    res.redirect("/")
});

Router.get("/admin-panel", requiresAuth(), async (req, res) => {
    let data = {};
    data.title = "Admin Panel";
    data.role = req.oidc.user.role[0];
    data.showCategories = await helpers.showCategories();
    if (req.oidc.user.role[0] != "admin") {
        return res.redirect("/")
    }

    res.render("pages/admin-panel.ejs", data);
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
