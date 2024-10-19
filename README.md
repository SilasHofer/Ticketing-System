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


Download the Project:

Download the zip file from GitHub and extract it to your desired destination on your Unix machine.
Navigate to the Project Directory:


cd Ticketing-System-main/
Install Node.js Dependencies:


npm install
Set Up the Database:

Navigate to the SQL directory:

cd sql/ticket_system
Install the MariaDB server (if not already installed):

sudo apt install mariadb-server
Reset the Database:

Run the following command to reset the database:

sudo mariadb --execute "source reset.sql;"
Then log into MariaDB:

sudo mariadb
Create Database User:

Execute the following commands in the MariaDB shell:

CREATE USER 'dbadm'@'localhost' IDENTIFIED BY 'P@ssw0rd';
GRANT ALL PRIVILEGES ON ticket_system.* TO 'dbadm'@'localhost';
FLUSH PRIVILEGES;
After executing these commands, type exit to leave the MariaDB shell.
Return to the Project Root Directory:


cd ../..
Start the Application:

node index.js
Log In to the Application:

Use the following credentials to log in:
Auth0 Email: ticketingsystem821@gmail.com
Auth0 Password: m3YbsCRsT3iSBK3
User Management:

Once logged in, navigate to User Management and then Users.
Create a new user by providing an email and password for the admin account.
In the list of users, click on the three dots and select Assign Roles, then choose only Admin.
Log In with the Admin User:

Use the newly created admin account to log in to the software.

### Test

TODO: Explain how unit- or integreation tests can be executed.

### Run

TODO: Explain how to run the project (client, server etc.).

## License

TODO: Add license and copyright notice.


 




