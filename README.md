# Ticketing System


## Introduction

This is a ticket system for companies where users can submit tickets for agents to review and then solve. 
It serves as communication software between an agent and a user.

![Example picture](https://github.com/SilasHofer/Ticketing-System/blob/main/readme-picture-1.png)

![Example picture](https://github.com/SilasHofer/Ticketing-System/blob/main/readme-picture-2.png)

## How to Use

### System Requirements

To run the server, you need either:

- **Ubuntu**: Version 20.04 LTS or newer is recommended for optimal compatibility and performance.
  
- **WSL 2.0**: If you are using Windows, you can install the Windows Subsystem for Linux (WSL) version 2.0. WSL allows you to run a Linux distribution alongside your Windows OS without needing a virtual machine. 

  To set up WSL 2.0, follow the instructions [here](https://docs.microsoft.com/en-us/windows/wsl/install). After installation, you can install Ubuntu from the Microsoft Store.

Make sure to choose the option that best suits your needs.

### Prerequisites

1. Check if node,npm and mariadb-server is installed

    ```bash
    node -v # (version 18.x or newer)
    npm -v  # (version 9.2 or newer)
    mariadb --version # (version 15.1 or newer)
    ```

    If any of these commands return an error or indicate that the software is not found, it means the respective software is not installed.

    If MariaDB is installed, verify that the service is running properly by executing:

    ```bash
    sudo systemctl status mariadb
    ```

    You should see output indicating that the service is **active (running)**. If it is not running, you can start it with the following command:

    ```bash
    sudo systemctl start mariadb
    ```

    To ensure that MariaDB starts automatically on boot, you can enable the service with:

    ```bash
    sudo systemctl enable mariadb
    ```


1. **npm**: You need to have npm installed on your Ubuntu machine. You can install it by running:

    ```bash
    sudo apt update
    sudo apt install npm
    ```

2. **Node.js**: You need to have Node.js installed on your Ubuntu machine  (version 18.x or newer). You can install it by running:

    ```bash
    sudo apt update 
    sudo apt install nodejs
    ```



3. **MariaDB Server**: You will also need the MariaDB server. 

    You can install it by running: 

    ```bash
    sudo apt update
    sudo apt install mariadb-server
    ```

4. **git**:: You will also need the git. 

    You can install it by running: 

    ```bash
    sudo apt update
    sudo apt install git
    ```
    

### Build


1. **Download the Project**:

    ```bash
    git clone <repository-url>
    ```

3. **Install Node.js Dependencies**:    
    
    ```bash
    cd <repository-directory>
    npm install
    ```


5. **Log into MariaDB**:

    ```bash
    sudo mariadb
    ```


6. **Create Database User**:

    Execute the following commands in the MariaDB shell:

    ```sql
    CREATE USER 'user_name'@'localhost' IDENTIFIED BY 'your_password';
    GRANT ALL PRIVILEGES ON ticket_system.* TO 'user_name'@'localhost';
    FLUSH PRIVILEGES;
    ```

    Replace `<user_name>` with your chosen username.

    Replace `<your_password>` with your chosen password.

    After executing these commands, type **exit** to leave the MariaDB shell.

7. Database configuration

    Open the file `config/db/ticket_system.json` and modify this:

    ```json
    {
        "host": "localhost",
        "user": "<user_name>",
        "password": "<your_password>",
        "database": "ticket_system",
        "multipleStatements": true
    }
    ```



    Replace `<user_name>` with the username you created.

    Replace `<your_password>` with the password you created.

    Save and return back:

    ```bash
    cd ../..
    ```

8. **Set Up the Database**:

    Navigate to the SQL directory:

    ```bash
    cd sql/ticket_system
    ```

    Run the following command to reset the database:

    ```bash
    sudo mariadb < reset.sql
    ```

7. **Return to the Project Root Directory**:

    ```bash
    cd ../..
    ```

8. **Configure express server**:

    1. In the project directory, open the file `config/config.js`.

2. Locate the `app` configuration section and edit the port and server IP to your desired values. (Note: `127.0.0.1` is localhost, which binds the server to your machine only).

    ```javascript
    app: {
        port: 3000,         // Set the port you want to use (default: 3000)
        server_ip: '127.0.0.1'  // Set the server IP (default: '127.0.0.1' for localhost)
    }
    ```

9. **Create Auth0 account**:

    Create an account on auth0.com if you don’t have one.

    **Auth0 Config**:


    1. Go to **Applications > Applications** and create a new application.

        1. Select a name for the application

        2. Select **Regular Web Applications**

        3. Select **Node.js (Express)** and then I want to integrate with my app

        4. Set 

        ```plaintext
        Allowed Callback URL http://<server_ip>:<port>/callback
        Allowed Logout URLs http://<server_ip>:<port>
        ```

        5. Hit next until you get "You're all set!" and then go to **Applications settings**.

        6. copy the **Domain** and scroll down to **Allowed Callback URLs**.

            Add `http://<domain>/login/callback` with a comma between the two URLs.
        
        7. Click **Save**.
    
    2. Go to **Applications > APIs > Auth0 Management API > Machine To Machine Applications**.

        1. Authorize your application

        2. click the arrow next to the Authorize button 

        3. add the following permissions
            
            - `read:users`
            - `update:users`
            - `delete:users`
            - `create:users`
            - `create:user_tickets`
            - `read:roles`
            - `update:roles`
            - `create:role_members`
            - `delete:role_members`
        
        4. Click **Update**.
    
    3. Go to **Actions > Library** and Create Action form scratch

        - **Name**: Add role to tokens
        - **Trigger**: Login / Post Login
        - **Runtime**: Node 18 (Recommended)


        then replace the code with this:

        ```javascript
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
        ```
        
        Then **deploy** and go to **Actions > Triggers**.

        Click **Post-login** and drag and drop the custom action between **start** and **Complete**.

        Then hit **apply**.

    4. Go to **User Management > Roles** and configure these roles:

        1. user
        2. agent
        3. admin

    5. Go to **Users**.

        Create a new user and then assign the admin role to it.

        You can create more users here if you want, but they need to have one role assigned to them.

        You can also create users via the web interface with the admin account.
    
10. **Configure Gmail account**:

    1. Create an gmail account for the system.

    2. When logged in to the Gmail account, go to settings in the top right corner and then **See all settings**.

    3. Go to **Forwarding and POP/IMAP** and enable **IMAP**. Hit **Save Changes**.

    4. Click on the user icon in the top left and then on **Manage your Google Account**.

    5. Go to **Security** and enable **2-Step Verification**.

    6. Search for **App passwords** and then create a new app and save the generated app password.


11. **System config**:

    1. In the project directory, open the file `config/config.js`.

    2. **Mail config**:

        ```javascript
        mail: {
            allowed_mail_domains: [
                "bth.se",
                "student.bth.se"
            ],
            source_email_host: 'imap.gmail.com',
            source_email_service: 'gmail',
            source_email: '<your-system-email>',
            source_email_password: '<your-email-app-password>',
        }
        ```

        Replace `<your-system-email>` with the email address you just created

        Replace `<your-email-app-password>` with the app password you just generated
    
    3. **Auth0 config**:

        ```javascript
        auth0: {
            AUTH_SECRET: 'b59770593843a845dc847b7e3645541665cb9849d11009327500a15c40c06c1f',
            AUTH_CLIENTID: '<your_auth0_client_id>',
            AUTH_CLIENTSECRET: '<your_auth0_client_secret>',
            AUTH_ISSUERBASEURL: 'https://<your_auth0_domain>',
            AUTH_CONNECTIONID: '<your_auth0_connections_id>',
        },
        role: {
            user: '<your_user_role_id>',
            agent: '<your_agent_role_id>',
            admin: '<your_admin_role_id>'
        }
        ```

        1. Login to the auth0 account and go to **Applications > Applications** and on the application you created before.

        2. In Settings you see the information you need for this:

            - Replace `<your_auth0_client_id>` with the Client ID.

            - Replace `<your_auth0_client_secret>` with the Client Secret.

            - Replace `<your_auth0_domain>` with the Domain. (Note: Do not remove the https://)

        3. To find `<your_auth0_connection_id>`: 

            1. Go to  **Authentication > Database** and select  **Username-Password-Authentication**.

            2. Then replace `<your_auth0_connections_id>` with the **Identifier** you see an that page. (Note: it should start with **con_**)
        
        4. Get Role IDs:

            1. Go to **User Management > Roles** and click on each role.

            2. Copy the **Role ID** for each role (Note: it should start with **rol_**)

            3. And replace `<your_user_role_id>` ,  `<your_agent_role_id>` and `<your_admin_role_id>` with the correct role ID.
        

    4. **File config**:

        Here you can change the settings how you like them to be:

        ```javascript
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
        ```

8. **Start the Application**:

    ```bash
    node index.js
    ```

10. **Log In with the Admin User**:

    Use the newly created admin account to log in to the software at `http://<server_ip>:<your_port>`.

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
    1. Send an email to `<your-system-mail>` from an account that is not an allowed mail domain (default not bth.se and student.bth.se) and does not have an account in the system.
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

1. As an Agent/Admin: You can access the system via the web interface at http://`<server_ip>`:`<your_port>`.
2. As a Normal User: You can interact with the system either through the web interface or by sending emails to `<your-system-mail>`.

Users can create accounts via email, so they don’t need to log in to the web interface to resolve their issues.

In the config.js file, you can add trusted email domains. If someone with a trusted domain sends an email to the system but does not have an account, the system will automatically create one. However, if the domain is not trusted, an admin will need to approve the user in the admin panel.

Additionally, in the config.js file, you can configure other options, such as the maximum number and size of files that can be attached to a ticket.


## License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.

Copyright (c) 2024 Silas Hofer.


 




