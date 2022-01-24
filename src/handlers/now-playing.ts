import axios from 'axios';

const { CLIENT_ID } = process.env;
const { CLIENT_SECRET } = process.env;
const { REFRESH_TOKEN } = process.env;

const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

async function getAccessToken() {
    const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
        'base64',
    );
    const response = await axios.post(TOKEN_ENDPOINT, {
        headers: {
            Authorization: `Basic ${basic}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: {
            grant_type: 'refresh_token',
            refresh_token: REFRESH_TOKEN,
        },
    });

    return response.data;
}

async function getNowPlaying() {
    const { access_token: accessToken } = await getAccessToken();

    return axios.get(NOW_PLAYING_ENDPOINT, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
}

export async function main(event: unknown) {
    return {
        body: JSON.stringify(await getNowPlaying()),
        headers: { 'Content-Type': 'application/json' },
        statusCode: 200,
    };
}
