const axios = require('axios');
require("dotenv").config()


const authConfig = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH_SECRET,
    baseURL: 'http://localhost:3000',
    clientID: process.env.AUTH_CLIENTID,
    issuerBaseURL: process.env.AUTH_ISSUERBASEURL
};

async function getAccessToken(scope) {
    try {
        // Get access token from Auth0
        const response = await axios.post(`${process.env.AUTH_ISSUERBASEURL}/oauth/token`, {
            client_id: process.env.AUTH_CLIENTID,
            client_secret: process.env.AUTH_CLIENTSECRET,
            audience: `${process.env.AUTH_ISSUERBASEURL}/api/v2/`,
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
        const userResponse = await axios.post(`${process.env.AUTH_ISSUERBASEURL}/api/v2/users`, {
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
            await axios.post(`${process.env.AUTH_ISSUERBASEURL}/api/v2/roles/${role_id}/users`, {
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

    const userResponse = await axios.patch(`${process.env.AUTH_ISSUERBASEURL}/api/v2/users/${user_id}`, {
        password: password,// User's password
        name: name,

    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    await axios.post(`${process.env.AUTH_ISSUERBASEURL}/api/v2/roles/rol_SbiBHiolJfOexDLM/users`, {
        users: [user_id]  // Send the user ID in the request body
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

}

async function getUsers() {
    const token = await getAccessToken('read:users');

    const usersResponse = await axios.get(`${process.env.AUTH_ISSUERBASEURL}/api/v2/users`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return usersResponse.data;

}


module.exports = {
    authConfig,
    createAccount,
    getUsers,
    editAccount
};
