import axios, { AxiosError } from 'axios';
import { URLSearchParams } from 'url';

const { CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN } = process.env;

const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const TOKEN_PARAMS = new URLSearchParams();
TOKEN_PARAMS.append('grant_type', 'refresh_token');
TOKEN_PARAMS.append('refresh_token', REFRESH_TOKEN ?? '');
const TOKEN_PARAMS_STRING = TOKEN_PARAMS.toString();

export async function getAccessToken() {
    const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
        'base64',
    );
    const headers = {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${basicAuth}`,
        },
    };

    try {
        const response = await axios.post(
            TOKEN_ENDPOINT,
            TOKEN_PARAMS_STRING,
            headers,
        );

        return response.data;
    } catch (error) {
        const err = error as AxiosError;
        console.error(err.message ?? 'error while getting access token');
        throw new Error('error while getting access token');
    }
}
