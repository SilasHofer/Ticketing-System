# Ticketing System


## Introduction

This is a ticket system for companies where users can submit tickets for agents to review and then solve. 
It serves as communication software between an agent and a user.

TODO: Add image that helps to understand the project.
This could be an architectural diagram or a screenshot of the application.

## Architecture Overview (optional)

TODO: Add simple diagram that explains the architecture.

## How to Use

### Prerequisites

1. Node.js: You need to have Node.js installed on your Ubuntu machine  (version 20.x recommended). You can install it by running: sudo apt install nodejs

2. MariaDB Server: You will also need the MariaDB server. You can install it by running: sudo apt install mariadb-server

### Build


1. Download the Project:

    Download the zip file from GitHub and extract it to your desired destination on your Unix machine.

2. Navigate to the Project Directory:

        cd Ticketing-System-main/

3. Install Node.js Dependencies:

        npm install

4. Set Up the Database:

    Navigate to the SQL directory:

        cd sql/ticket_system

    Install the MariaDB server (if not already installed):

        sudo apt install mariadb-server

4. Reset the Database:

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

    Use the following credentials to at auth0.com:

    Auth0 Email: ticketingsystem821@gmail.com

    Auth0 Password: m3YbsCRsT3iSBK3

    Once logged in, navigate to User Management and then Users.
    Create a new user by providing an email and password for the admin account.
    In the list of users, click on the three dots and select Assign Roles, then choose only Admin.

10. Log In with the Admin User:

    Use the newly created admin account to log in to the software at http://localhost:3000.

### Test

TODO: Explain how unit- or integreation tests can be executed.

### Run

TODO: Explain how to run the project (client, server etc.).

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.

Copyright (c) 2024 Silas Hofer.


 




