import axios, { AxiosError } from 'axios';

import { getAccessToken } from './utils/token';
import { getTrackInfo } from './utils/track';

const { CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN } = process.env;

const TOP_TRACKS_ENDPOINT = 'https://api.spotify.com/v1/me/top/tracks';

async function getTopTracks() {
    const { access_token: accessToken } = await getAccessToken();

    try {
        const response = await axios.get(TOP_TRACKS_ENDPOINT, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params: { limit: 10, time_range: 'short_term' },
        });
        console.log(`top tracks ${JSON.stringify(response.data, null, 2)}`);

        const data = response.data;

        return data.items.map((track: any) => getTrackInfo(track));
    } catch (error) {
        const err = error as AxiosError;
        console.error(err.message ?? 'error while getting now playing');
        return [];
    }
}

export async function main(_event: unknown) {
    if (CLIENT_ID === '' || CLIENT_SECRET === '' || REFRESH_TOKEN === '') {
        throw new Error('secrets not initialized');
    }

    const topTracks = await getTopTracks();
    console.log(JSON.stringify(topTracks, null, 2));

    return {
        body: JSON.stringify(topTracks),
        headers: { 'Content-Type': 'application/json' },
        statusCode: 200,
    };
}
