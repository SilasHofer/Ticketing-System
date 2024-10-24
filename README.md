# Ticketing System


## Introduction

This is a ticket system for companies where users can submit tickets for agents to review and then solve. 
It serves as communication software between an agent and a user.

![Example picture](https://github.com/SilasHofer/Ticketing-System/blob/main/readme-picture-2.png)

![Example picture](https://github.com/SilasHofer/Ticketing-System/blob/main/readme-picture-2.png)

## How to Use

### Prerequisites

1. check if node,npm and mariadb-server is installed

        node -v (version 18.x or newer)
        npm -v (version 9.2 or newer)
        sudo mariadb (it is installed when you get in to the mariadb consol (MariaDB [(none)]>) then exit with exit)

1. npm: You need to have npm installed on your Ubuntu machine. You can install it by running:

        sudo apt update
        sudo apt install npm

2. Node.js: You need to have Node.js installed on your Ubuntu machine  (version 18.x or newer). You can install it by running:

        sudo apt update 
        sudo apt install nodejs



3. MariaDB Server: You will also need the MariaDB server. 

    You can install it by running: 

        sudo apt update
        sudo apt install mariadb-server

4. git: You will also need the git. 

    You can install it by running: 

        sudo apt update
        sudo apt install git
    

### Build


1. Download the Project:

        git clone <repository-url>

3. Install Node.js Dependencies:    
    
    go to the directory where you just cloned the repository

        npm install


5. Then log into MariaDB:

        sudo mariadb

6. Create Database User:

    Execute the following commands in the MariaDB shell:

        CREATE USER 'user_name'@'localhost' IDENTIFIED BY 'your_password';
        GRANT ALL PRIVILEGES ON ticket_system.* TO 'user_name'@'localhost';
        FLUSH PRIVILEGES;

    After executing these commands, type exit to leave the MariaDB shell.

7. Database configuration

    open the file  config/db/ticket_system.json

    modify this 
        
        {
        "host": "localhost",
        "user": "<user_name>",
        "password": "<your_password>",
        "database": "ticket_system",
        "multipleStatements": true
        }

    save and return back:

        cd ../..

8. Set Up the Database:

    Navigate to the SQL directory:

        cd sql/ticket_system

    Run the following command to reset the database:

        sudo mariadb --table < reset.sql

7. Return to the Project Root Directory:

        cd ../..

9. Create Auth0 account

    Create an account of auth0.com if you don,t have one

    Auth0 Config

    1. Go to the Applications > Applications and create a new application.

        1. Select a name for the application

        2. Select Regular Web Applications

        3. Select Node.js (Express) and then I want to integrate with my app

        4. Set 

            Allowed Callback URL http://<express_ip>:<port>/callback

            Allowed Logout URLs http://<express_ip>:<port>

        5. Hit next until you get "You're all set!" and then go to Applications settings

        6. copy the Domain and scroll down to Allowed Callback URLs

            Add http://<domain>/login/callback with , between the tow URLs
        
        7. click Save
    
    2. Go to Applications > APIs > Auth0 Management API > Machine To Machine Applications

        1. Authorize your application

        2. click the arrow next to the Authorize button 

        3. add the following permissions
            
            * read:users
            
            * update:users

            * delete:users

            * create:users

            * create:user_tickets

            * read:roles

            * update:roles

            * create:role_members

            * delete:role_members
        
        4. Click Update
    
    3. Go to Actions > Library and Create Action form scratch

        Name: Add role to tokens

        Trigger: Login / Post Login

        Runtime: Node 18 (Recommended)

        then replace the code with this:

            /**
            * Handler that will be called during the execution of a PostLogin flow.
            *
            * @param {Event} event - Details about the user and the context in which they are logging in.
            * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
            */
            exports.onExecutePostLogin = async (event, api) => {
            const namespace = 'role';
                if (event.authorization) {
                    api.idToken.setCustomClaim(`${namespace}`, event.authorization.roles);
                    api.accessToken.setCustomClaim(`${namespace}`, event.authorization.roles);
                }
            }
        
        then Deploy and go to Actions > Triggers

        then click Post-login and drag an drop the custom action between start and Complete

    4. Go to User Management > Roles and configure thies roles:

        1. user
        2. agent
        3. admin

    5. Go to Users

        Create a new user and then assign the admin role to it

        You can create more user her if you whan,t but they need to have one role assigned to them

        You can also create users via the webinterface with the admin account.
    
10. Configure gmail account

    1. Create an gmail account for the system

    2. When logged in to the gmail account go to settings in the top right corner and then See all settings

    3. go to Forwarding and POP/IMAP and the enable IMAP. Hit Save Changes

    4. Klick on the user icon in the top left and then on Manage your Google Account

    5. Go to Security and enable 2-Step Verification

    6. Search for App passwords and then create a new app and save the Generated app password


11. System config

    1. In the projekt directory open the file config/config.js

    2. mail config

            mail: {
            allowed_mail_domains: [
                "bth.se",
                "student.bth.se"
            ],
            source_email_host: 'imap.gmail.com',
            source_email_service: 'gmail',
            source_email: '<your-system-email>',
            source_email_password: '<your-email-app-passowrd>',
            }
    
    3. auth0 config

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

        Need to explane where alle the addres are found

    4. file config

        here you can change the settings how you like them to be

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
            }

8. Start the Application:

        node index.js

10. Log In with the Admin User:

    Use the newly created admin account to log in to the software at http://localhost:<your_port>.

### Test

To ensure the software functions correctly, I performed manual testing throughout the development process. Below are som example test that where made:

1. User Registration:

    1. Log in as an Admin.
    2. Navigate to the Admin Panel and then select Create Account.
    3. Attempt to create an account using a weak password and passwords that do not match.
    4. Create a valid account with strong and matching passwords.
    5. Try to use the same email address again to create another account.
    6. Log in to the account you just created to verify that the login works successfully.

2. Add Category:

    1. Log in as an Admin or Agent.
    2. Navigate to the Admin/Agent Panel and select Create Category.
    3. Enter a Category Name and click Add.
    4. Verify that the Category appears in the table.
    5. Log in as a User and attempt to create a ticket using that category.
    6. Log in as Admin or Agent again and remove the category

3. Ticket Creation:
    1. Log in as a User.
    2. Click on "Create Ticket."
    3. Add a Title and Description.
    4. Select a Category.
    5. Attach Files:
    Try to add too many files, files that are too large, or files in the wrong format.
    6. Attempt to Create the Ticket.
    7. Create a Ticket with the correct number of files, appropriate size, and acceptable format.
    8. Open the Created Ticket to verify its contents.
    9. Log in as an Admin or Agent and ensure that the ticket is displayed correctly.

4. Send Emails (Note: It may take time for the server to process emails)
    1. Send an email to <your-system-mail> from an account that is not an allowed mail domain (default not bth.se and student.bth.se) and does not have an account in the system.
    2. Log in as Admin and navigate to the Admin Panel, then go to Account Requests.
    3. Look for the email address that you just sent from (reload the page to update the table with requests).
    4. Click "No" when prompted, and check the email you receive in response.
    5. Send a new email from the same address but click "Yes" in the Admin Panel this time.
    6. Check your email for the account data. You don’t need to reset the password, but you can if you wish.
    8. Send a new email with the ticket title as the email subject and the ticket description in the body And attachments from the mail is added to the ticket
    9. Log in to the web interface with the Admin account and look for the newly created ticket.
    10. Open the ticket, claim it, and add a comment.
    11. Check your email; you should have received three emails: one for creating the ticket, one for claiming it, and one for the comment.
    12. Reply to one of these emails and verify that the text you included appears as a comment on the ticket when logged in with the Admin account.
    13. Send a final reply that simply says "CLOSED" from the email address.



### Run

To use the software:

1. As an Agent/Admin: You can access the system via the web interface at http://localhost:<your_port>.
2. As a Normal User: You can interact with the system either through the web interface or by sending emails to <your-system-mail>.

Users can create accounts via email, so they don’t need to log in to the web interface to resolve their issues.

In the config.js file, you can add trusted email domains. If someone with a trusted domain sends an email to the system but does not have an account, the system will automatically create one. However, if the domain is not trusted, an admin will need to approve the user in the admin panel.

Additionally, in the config.js file, you can configure other options, such as the maximum number and size of files that can be attached to a ticket.


## License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.

Copyright (c) 2024 Silas Hofer.


 




