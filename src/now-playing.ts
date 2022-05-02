import axios, { AxiosError } from 'axios';

import { getAccessToken } from './utils/token';
import { getTrackInfo } from './utils/track';

const { CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN } = process.env;

const NOW_PLAYING_ENDPOINT =
    'https://api.spotify.com/v1/me/player/currently-playing';

async function getNowPlaying() {
    const { access_token: accessToken } = await getAccessToken();

    try {
        const response = await axios.get(NOW_PLAYING_ENDPOINT, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        console.log(`playing ${JSON.stringify(response.data, null, 2)}`);

        const data = response.data;
        if (data.is_playing && data.currently_playing_type === 'track') {
            return {
                is_playing: true,
                ...getTrackInfo(data.item),
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

    const nowPlaying = await getNowPlaying();
    console.log(JSON.stringify(nowPlaying, null, 2));

    return {
        body: JSON.stringify(nowPlaying),
        headers: { 'Content-Type': 'application/json' },
        statusCode: 200,
    };
}
