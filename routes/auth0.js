const axios = require('axios');
const config = require('../config/config.js');


const authConfig = {
    authRequired: false,
    auth0Logout: true,
    secret: config.auth0.AUTH_SECRET,
    baseURL: 'http://localhost:3000',
    clientID: config.auth0.AUTH_CLIENTID,
    issuerBaseURL: config.auth0.AUTH_ISSUERBASEURL
};

async function getAccessToken(scope) {
    try {
        // Get access token from Auth0
        const response = await axios.post(`${config.auth0.AUTH_ISSUERBASEURL}/oauth/token`, {
            client_id: config.auth0.AUTH_CLIENTID,
            client_secret: config.auth0.AUTH_CLIENTSECRET,
            audience: `${config.auth0.AUTH_ISSUERBASEURL}/api/v2/`,
            grant_type: 'client_credentials',
            scope: scope
        });

        // Extract access token from the response
        const accessToken = response.data.access_token;

        // Return the access token
        return accessToken;

    } catch (error) {
        console.error('Error fetching access token:', error);
        throw error; // Optionally re-throw the error for further handling
    }
}

async function createAccount(email, password, name, role_id) {
    try {
        const token = await getAccessToken('create:users update:roles create:role_members')
        // Use access token to call the Auth0 Management API
        const userResponse = await axios.post(`${config.auth0.AUTH_ISSUERBASEURL}/api/v2/users`, {
            email: email,  // User's email
            password: password,// User's password
            name: name,
            connection: 'Username-Password-Authentication',  // Specify the Auth0 connection
            user_metadata: {               // Optional: any additional metadata for the user
                subscription: 'free'
            }

        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const userId = userResponse.data.user_id;
        if (role_id != "") {
            await axios.post(`${config.auth0.AUTH_ISSUERBASEURL}/api/v2/roles/${role_id}/users`, {
                users: [userId]  // Send the user ID in the request body
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        }
        return { success: true, message: 'User created and role assigned', userId: userId };

    } catch (error) {
        // Handle 409 Conflict error when the user already exists
        if (error.response && error.response.status === 409) {
            return { success: false, message: 'The user already exists.' };
        } else {
            // Handle any other error
            return { success: false, message: `Error: ${error.message}` };
        }
    }
}

async function editAccount(user_id, name, password) {
    const token = await getAccessToken('update:users update:roles create:role_members')

    const userResponse = await axios.patch(`${config.auth0.AUTH_ISSUERBASEURL}/api/v2/users/${user_id}`, {
        password: password,// User's password
        name: name,

    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    await axios.post(`${config.auth0.AUTH_ISSUERBASEURL}/api/v2/roles/rol_SbiBHiolJfOexDLM/users`, {
        users: [user_id]  // Send the user ID in the request body
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

}


async function getResetPasswordLink(mail) {
    try {
        // Get a management API token with the necessary scope
        const token = await getAccessToken('update:users create:user_tickets');

        // Prepare the request body
        const data = {
            email: mail,
            connection_id: config.auth0.AUTH_CONNECTIONID
            // Optionally specify the connection_id if you have multiple database connections
            // connection_id: 'YOUR_AUTH0_CONNECTION_ID' // Only required if you have multiple connections
        };

        // Send the request to create a password change ticket
        const response = await axios.post(`${config.auth0.AUTH_ISSUERBASEURL}/api/v2/tickets/password-change`, data, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        // Return the response (which contains the password reset ticket link)
        return response.data.ticket;

    } catch (error) {
        console.error('Error sending password reset link:', error);
        throw error; // Optionally re-throw the error for further handling
    }
}

async function getAllUsers() {
    const token = await getAccessToken('read:users');

    const usersResponse = await axios.get(`${config.auth0.AUTH_ISSUERBASEURL}/api/v2/users`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return usersResponse.data;
}

async function getAgentUsers() {
    const token = await getAccessToken("read:roles");

    try {
        // Fetch users associated with the first role
        const response1 = await axios.get(`${config.auth0.AUTH_ISSUERBASEURL}/api/v2/roles/rol_iUczGqqs32uPEhUe/users`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // Fetch users associated with the second role
        const response2 = await axios.get(`${config.auth0.AUTH_ISSUERBASEURL}/api/v2/roles/rol_q8gMQ7JR1S2hYePM/users`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // Combine the users from both responses using a Set to eliminate duplicates by user ID
        const usersMap = new Map();

        // Add users from the first response
        response1.data.forEach(user => usersMap.set(user.user_id, user));

        // Add users from the second response (overwrite if the user already exists)
        response2.data.forEach(user => usersMap.set(user.user_id, user));

        // Convert the map back to an array of user objects
        const combinedUsers = Array.from(usersMap.values());

        return combinedUsers; // Return combined users array
    } catch (error) {
        console.error('Error fetching users by roles:', error.message);
        throw error; // Rethrow the error for further handling
    }
}

async function deleteUser(userID) {
    try {
        // Get the access token for the Management API
        const token = await getAccessToken("delete:users");

        // Send a DELETE request to the Auth0 Management API to delete the user
        const response = await axios.delete(`${config.auth0.AUTH_ISSUERBASEURL}/api/v2/users/${userID}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // Optionally handle the response (e.g., log success or return a message)
        console.log(`User with ID ${userID} deleted successfully.`);
        return response.data; // or handle as needed

    } catch (error) {
        // Handle errors (e.g., user not found, insufficient permissions)
        console.error(`Error deleting user with ID ${userID}:`, error.response ? error.response.data : error.message);
        throw error; // Re-throw the error if you want it to propagate
    }
}



module.exports = {
    authConfig,
    createAccount,
    getAllUsers,
    editAccount,
    getResetPasswordLink,
    getAgentUsers,
    deleteUser
};
