const nodemailer = require('nodemailer');
const config = require('../config/config.js');
const Imap = require('node-imap');
const { simpleParser } = require('mailparser');
const auth0 = require("./auth0.js");
const helpers = require("../src/helpers.js");

const generatePassword = require('generate-password');



let transporter = nodemailer.createTransport({
    service: 'gmail', // You can use any provider like 'yahoo', 'hotmail', 'outlook', etc.
    auth: {
        user: process.env.source_email,   // The email to send from
        pass: process.env.source_email_password     // The email password or app-specific password
    }
});

function sendEmailToUser(to, emailsubject, emailText) {
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

const imapConfig = {
    user: process.env.source_email,
    password: process.env.source_email_password,
    host: 'imap.gmail.com',
    port: 993,
    tls: true,

    keepalive: true,
};

const imap = new Imap(imapConfig);

// Function to open inbox
function openInbox(cb) {
    imap.openBox('INBOX', false, cb);
}
// Establish the connection
imap.connect();

imap.once('ready', function () {
    openInbox(function (err, box) {
        if (err) throw err;
        console.log('IMAP connection ready and listening for new emails.');
        setInterval(() => {
            fetchUnseenEmails();
        }, 10000);
    });
});

function fetchUnseenEmails() {
    imap.search(['UNSEEN'], (err, results) => {
        if (err || !results.length) {
            console.log('No new unseen emails.');
            return;
        }

        console.log(`Found ${results.length} unseen emails.`);

        const fetch = imap.fetch(results, { bodies: '', markSeen: true });
        fetch.on('message', function (msg) {
            let buffer = '';

            msg.on('body', function (stream) {
                stream.on('data', function (chunk) {
                    buffer += chunk.toString('utf8');
                });
            });

            msg.once('end', function () {
                simpleParser(buffer, (err, mail) => {
                    if (err) {
                        console.error('Error parsing email:', err);
                        return;
                    }
                    console.log('New email received:', mail.subject);
                    console.log('From:', mail.from.text);
                    console.log('Body:', mail.text);
                    emailReceived(mail)

                });
            });
        });

        fetch.once('error', (err) => {
            console.error('Fetch error:', err);
        });
    });
}

// Error handling
imap.once('error', function (err) {
    console.error('IMAP connection error:', err);
});

imap.once('end', function () {
    console.log('IMAP connection ended.');
});

imap.once('close', function (hasError) {
    console.log('IMAP connection closed.');
});

async function emailReceived(mail) {
    const fromAddress = mail.from?.value?.[0]?.address;
    const users = await auth0.getUsers();
    // Extract the email addresses
    const emailAddresses = users.map(user => user.email);

    if (emailAddresses.includes(fromAddress)) {
        const user = users.find(user => user.email === fromAddress);
        await helpers.createTicket(user.user_id, 1, user.name, user.email, mail.subject, mail.text);
        sendEmailToUser(user.email, 'Ticket Created', 'Your ticket ' + mail.subject + ' has been successfully created!');

    } else if (config.mail.allowed_mail_domains.includes(fromAddress.split('@')[1])) {
        const password = generatePassword.generate({
            length: 10,           // Length of the password
            numbers: true,        // Include numbers
            symbols: true,        // Include symbols
            uppercase: true,      // Include uppercase letters
            lowercase: true,      // Include lowercase letters
            excludeSimilarCharacters: true // Exclude similar characters like 'i', 'l', '1', 'O', '0'
        });
        auth0.createAccount(fromAddress, password, 'temp', 'rol_SbiBHiolJfOexDLM');
        sendEmailToUser(fromAddress, 'An account has ben created for you', 'You can now login with this mail: ' + fromAddress + ' and this password: ' + password + ' on this  http://localhost:3000/ ');

    } else {

    }
}


module.exports = {
    sendEmailToUser
};
