import axios, { AxiosError } from 'axios';
import { URLSearchParams } from 'url';

const { CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN } = process.env;

if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    throw new Error('environment variables not present');
}

const NOW_PLAYING_ENDPOINT =
    'https://api.spotify.com/v1/me/player/currently-playing';
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const TOKEN_PARAMS = new URLSearchParams();
TOKEN_PARAMS.append('grant_type', 'refresh_token');
TOKEN_PARAMS.append('refresh_token', REFRESH_TOKEN);
const TOKEN_PARAMS_STRING = TOKEN_PARAMS.toString();

async function getAccessToken() {
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

async function getNowPlaying() {
    const { access_token: accessToken } = await getAccessToken();

    try {
        const response = await axios.get(NOW_PLAYING_ENDPOINT, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        console.log(`playing ${JSON.stringify(response.data, null, 2)}`);

        if (response.data?.is_playing) {
            return {
                is_playing: true,
                artists: response.data?.item?.artists,
                currently_playing_type: response.data?.currently_playing_type,
                name: response.data?.item?.name,
                url: response.data?.item?.external_urls?.spotify,
            };
        }
        return {
            is_playing: false,
        };
    } catch (error) {
        const err = error as AxiosError;
        console.error(err.message ?? 'error while getting now playing');
        return {
            is_playing: false,
        };
    }
}

export async function main(_event: unknown) {
    if (CLIENT_ID === '' || CLIENT_SECRET === '' || REFRESH_TOKEN === '') {
        throw new Error('secrets not initialized');
    }

    return {
        body: JSON.stringify(await getNowPlaying()),
        headers: { 'Content-Type': 'application/json' },
        statusCode: 200,
    };
}
