
// config.js

// Read environment variables or provide defaults
const config = {
    app: {
        port: 3000,
        server_ip: '127.0.0.1'
    },
    file: {
        max_files: 3,
        max_file_size: 2,
        uploads_directory: 'public/user_files/',
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
        source_email_host: 'imap.gmail.com',
        source_email_service: 'gmail',
        source_email: '<your-system-email>',
        source_email_password: '<your-email-app-passowrd>',
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
        AUTH_CLIENTID: '<your_auth0_client_id>',
        AUTH_CLIENTSECRET: '<your_auth0_client_secret>',
        AUTH_ISSUERBASEURL: 'https://<your_auth0_domain>',
        AUTH_CONNECTIONID: '<your_auth0_connections_id>',
    },
    role: {
        user: '<your_user_role_id>',
        agent: '<your_user_agent_id>',
        admin: '<your_user_admin_id>'
    }
};

module.exports = config;
