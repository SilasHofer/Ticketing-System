# Ticketing System


## Introduction

This is a ticket system for companies where users can submit tickets for agents to review and then solve. 
It serves as communication software between an agent and a user.

TODO: Add image that helps to understand the project.
This could be an architectural diagram or a screenshot of the application.

## How to Use

### Prerequisites

1. Node.js: You need to have Node.js installed on your Ubuntu machine  (version 20.x recommended). You can install it by running:

        sudo apt update 
        sudo apt install nodejs

1. npm: You need to have npm installed on your Ubuntu machine. You can install it by running:

        sudo apt install npm

2. MariaDB Server: You will also need the MariaDB server. You can install it by running: 

        sudo apt install mariadb-server

### Build


1. Download the Project:

    Download the zip file from GitHub and extract it to your desired destination on your Unix machine.

2. Navigate to the Project Directory:

        cd your-path/Ticketing-System-main/

3. Install Node.js Dependencies:

        npm install

4. Set Up the Database:

    Navigate to the SQL directory:

        cd sql/ticket_system

    Run the following command to reset the database:

        sudo mariadb --table < reset.sql

5. Then log into MariaDB:

        sudo mariadb

6. Create Database User:

    Execute the following commands in the MariaDB shell:

        CREATE USER 'dbadm'@'localhost' IDENTIFIED BY 'P@ssw0rd';
        GRANT ALL PRIVILEGES ON ticket_system.* TO 'dbadm'@'localhost';
        FLUSH PRIVILEGES;

    After executing these commands, type exit to leave the MariaDB shell.

7. Return to the Project Root Directory:

        cd ../..

8. Start the Application:

        node index.js

9. Create admin account

    1. Use the following credentials to at auth0.com:

        Auth0 Email: ticketingsystem821@gmail.com

        Auth0 Password: m3YbsCRsT3iSBK3

    2. Once logged in, navigate to User Management and then Users.

    3. Create a new user by providing an email and password for the admin account.

    4. On the user page click Roles and then assign Roles

    5. select Admin and the hit assign


10. Log In with the Admin User:

    Use the newly created admin account to log in to the software at http://localhost:3000.

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
    1. Send an email to ticketsystem8@gmail.com from an account that is not an allowed mail domain (default not bth.se and student.bth.se) and does not have an account in the system.
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

1. As an Agent/Admin: You can access the system via the web interface at http://localhost:3000.
2. As a Normal User: You can interact with the system either through the web interface or by sending emails to ticketsystem8@gmail.com.

Users can create accounts via email, so they don’t need to log in to the web interface to resolve their issues.

In the config.js file, you can add trusted email domains. If someone with a trusted domain sends an email to the system but does not have an account, the system will automatically create one. However, if the domain is not trusted, an admin will need to approve the user in the admin panel.

Additionally, in the config.js file, you can configure other options, such as the maximum number and size of files that can be attached to a ticket.


## License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.

Copyright (c) 2024 Silas Hofer.


 




