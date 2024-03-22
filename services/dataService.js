import client from "../utils/client.js"

export const getArtistById = async (id) => {

    try {
        const artist = await client.artistes.findFirst({
            where: {
                id_: id,
                name_: {
                    not: "0"
                }
            }
        })

        return artist;
    } catch (error) {
        throw new Error(error)
    }
}


export const getArtistsSongs = async (artist_id) => {
    try {
        const songs = await client.artists_videos.findMany({
            where: {
                artist_id: artist_id
            }
        })

        return songs
    } catch (error) {
        throw new Error(error)
    }
}

export const getArtistByName = async (name) => {

    try {
        const artist = await client.artistes.findFirst({
            where: {
                name_: name
            }
        })

        return artist;
    } catch (error) {
        throw new Error(error)
    }
}