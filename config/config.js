
// config.js

// Read environment variables or provide defaults
const config = {
    app: {
        port: process.env.PORT || 3000
    },
    file: {
        max_files: 3,
        max_file_size: 2,
        allowed_mime_types: [
            "image/jpeg",
            "image/png",
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ],
        allowed_extensions: [
            ".jpg",
            ".jpeg",
            ".png",
            ".pdf",
            ".docx"
        ]
    },
    mail: {
        allowed_mail_domains: [
            "bth.se",
            "student.bth.se"
        ],
        source_email: 'ticketsystem8@gmail.com',
        source_email_password: 'kqwf obws yoth apzu',
    },
    status: {
        ticketStatuses: [
            'Created',
            'Processed',
            'Solved',
            'Closed'
        ],
    },
    auth0: {
        AUTH_SECRET: 'b59770593843a845dc847b7e3645541665cb9849d11009327500a15c40c06c1f',
        AUTH_CLIENTID: 'n5j0r0Jbr5TdluK5Zd6BDsvgSQnXkaj6',
        AUTH_CLIENTSECRET: '-edsn5gSDKYBrP52i79UEaxz6stMO4IXezn-gDVm-AaC2tos5mn8qUztWQtjBXIO',
        AUTH_ISSUERBASEURL: 'https://ticketing-system.eu.auth0.com',
        AUTH_CONNECTIONID: 'con_XkxeHZk06XP1K2O9',
    },
    role: {
        user: 'rol_noPghTuFtxv0p9Tc',
        agent: 'rol_NJdhv6EIRy437s4h'

    }
};

module.exports = config;
