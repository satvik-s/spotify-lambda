export function getTrackInfo(track: any) {
    return {
        album: track?.album?.name,
        album_image_url: track?.album?.images?.[0]?.url,
        album_url: track?.album?.external_urls?.spotify,
        artists: track?.artists
            ?.map((artist: { name: string }) => artist.name)
            .join(', '),
        track_name: track?.name,
        track_url: track?.external_urls?.spotify,
    };
}
