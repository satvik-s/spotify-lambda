import axios, { AxiosError } from 'axios';

import { getAccessToken } from './utils/token';
import { getTrackInfo } from './utils/track';

const { CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN } = process.env;

const NOW_PLAYING_ENDPOINT =
    'https://api.spotify.com/v1/me/player/currently-playing';

async function getNowPlaying(queryParams?: Record<string, string>) {
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
            const trackInfo = getTrackInfo(data.item);

            if (
                queryParams?.detailed === 'true' &&
                data.context?.type === 'playlist'
            ) {
                const playlistInfo = await getPlaylistInfo(
                    data.context?.href,
                    accessToken,
                );
                return {
                    is_playing: true,
                    ...trackInfo,
                    ...playlistInfo,
                };
            }
            return {
                is_playing: true,
                ...trackInfo,
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

async function getPlaylistInfo(href: string, accessToken: string) {
    const response = await axios.get(href, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    const data = response.data;

    return {
        playlist: data.name,
        playlist_url: data.external_urls?.spotify,
    };
}

export async function main(event: {
    queryStringParameters?: Record<string, string>;
}) {
    if (CLIENT_ID === '' || CLIENT_SECRET === '' || REFRESH_TOKEN === '') {
        throw new Error('secrets not initialized');
    }

    const nowPlaying = await getNowPlaying(event.queryStringParameters);
    console.log(JSON.stringify(nowPlaying, null, 2));

    return {
        body: JSON.stringify(nowPlaying),
        headers: { 'Content-Type': 'application/json' },
        statusCode: 200,
    };
}
