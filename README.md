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

TODO: Explain which steps and dependencies are required to run and build the project (e.g., pip install -r requirements.txt)

### Build

In your unix install npm (sudo apt install npm) and nodejs (sudo apt install nodejs)

download the yip file form github and extrakt it to your desigerde destination in your unix. 

do cd Ticketing-System-main/
and the npm install

go to the directary cd sql/ticket_system

and do this sudo apt install mariadb-server

and there do this comment sudo mariadb --table < reset.sql

then sudo mariadb 

and then this code CREATE USER 'dbadm'@'localhost' IDENTIFIED BY 'P@ssw0rd';
GRANT ALL PRIVILEGES ON ticket_system.* TO 'dbadm'@'localhost';
FLUSH PRIVILEGES;

after that write exit

and then you need to go back to ther oterh diractory so cd ../..

and then node index.js 


then login to this auth account in your browser
outh0-mail:ticketingsystem821@gmail.com
outh0-password:m3YbsCRsT3iSBK3

and then go to User Management and the users

and then create user 

shows an mail and password for the admin user

then in the list of users click on the 3 dots and then assign roles and then pick only admin 

now login with that user to the software

### Test

TODO: Explain how unit- or integreation tests can be executed.

### Run

TODO: Explain how to run the project (client, server etc.).

## License

TODO: Add license and copyright notice.


 




