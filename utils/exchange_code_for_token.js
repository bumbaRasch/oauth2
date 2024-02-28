// utils/exchange_code_for_token.js
import axios from 'axios';

export const exchange_code_for_token = async (code, client_id, client_secret, redirect_uri) => {
    try {
        const response = await axios({
            method: 'post',
            url: 'http://localhost:3000/oidc/token',
            headers: {
                'Authorization': 'Basic ' + Buffer.from(`${client_id}:${client_secret}`).toString('base64')
            },
            data: {
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: redirect_uri
            }
        });
        return response.data.access_token;
    } 
    catch (error) {
        console.error(error);
        return null;
    }
};