export function getTrackInfo(track: any) {
    return {
        artists: track?.artists
            ?.map((artist: { name: string }) => artist.name)
            .join(', '),
        track_name: track?.name,
        album: track?.album?.name,
        album_image_url: track?.album?.images?.[0]?.url,
        track_url: track?.external_urls?.spotify,
    };
}
