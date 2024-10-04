
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
    },
    status: {
        ticketStatuses: [
            'Created',
            'Processed',
            'Solved',
            'Closed'


        ],
    }
};

module.exports = config;
