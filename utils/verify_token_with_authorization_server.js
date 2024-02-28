import axios from 'axios';

export const verify_token_with_authorization_server = async (token, client_id, client_secret) => {
    try {
        const response = await axios({
            method: 'post',
            url: 'http://localhost:3000/oidc/check_token',
            headers: {
                'Authorization': 'Basic ' + Buffer.from(`${client_id}:${client_secret}`).toString('base64')
            },
            data: {
                token: token
            }
        });
        return response.data.active;
    } 
    catch (error) {
        console.error(error);
        return false;
    }
};