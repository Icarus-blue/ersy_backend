import expressAsyncHandler from "express-async-handler";
import client from "../utils/client.js";
import { getArtistById, getArtistByName, getArtistsSongs } from "../services/dataService.js";
import { Prisma } from "@prisma/client";

const generateWhere = (query, album_id) => {

    return { ...where }
}

export const getMusicVideos = expressAsyncHandler(async (req, res, next) => {

    const { page, pageSize, query, album_id, category } = req.query
    let videos = []
    if (query !== undefined || album_id !== undefined) {
        videos = await client.videos.findMany({
            take: parseInt(pageSize),
            skip: (page - 1) * pageSize,
            distinct: ['title', 'album_id', 'id_'],
            where: {
                OR: [
                    {
                        title: { contains: query }
                    },
                    { album_id: parseInt(album_id) },
                ]
            }
        });
    } else {
        console.log('hello');
        videos = await client.videos.findMany({
            take: parseInt(pageSize),
            skip: (page - 1) * pageSize,
            distinct: ['title', 'album_id', 'id_']
        });
        console.log(videos);
    }

    if (category === 'trending') {
        videos = await client.videos.findMany({
            take: 200,
            // skip: (page - 1) * pageSize,
            distinct: ['title', 'album_id', 'id_'],
            where: {
                OR: [
                    {
                        title: { contains: query }
                    },
                    { album_id: parseInt(album_id) },
                ]
            }
        });
        videos = videos.filter((video) => parseInt(video.views) > 10000000)
    }
    res.status(200).json({
        status: true,
        videos
    })
})

export const getMusicVideosByGenre = expressAsyncHandler(async (req, res, next) => {

    const { genre, page = 1, pageSize = 10 } = req.query;

    if (!genre) {
        return res.status(400).json({ message: 'Genre is required' });
    }

    const offset = (page - 1) * pageSize;

    const videosByGenre = await client.$queryRaw`
            SELECT * FROM videos
            WHERE FIND_IN_SET(${genre}, genre) > 0
            LIMIT ${pageSize} OFFSET ${offset}
        `;


    res.status(200).json({
        status: true,
        artists: videosByGenre.filter((artist, index, arr) => arr.indexOf(artist) === index)
    })
})

export const getArtistes = expressAsyncHandler(async (req, res, next) => {

    const { page, pageSize, query } = req.query
    // const where = generateWhere(query)
    let where = {
        name_: {
            not: '0'
        }
    };

    if (query) {
        where.name_ = {
            contains: query
        };
    }
    console.log('where', where)
    const artistes = await client.artistes.findMany({
        take: parseInt(pageSize),
        skip: (page - 1) * pageSize,
        distinct: ['id_'],
        where: where

    })

    res.status(200).json({
        status: true,
        artists: artistes.filter((artist, index, arr) => arr.indexOf(artist) === index)
    })
})

export const getArtistesByGenre = expressAsyncHandler(async (req, res, next) => {

    const { genre, page = 1, pageSize = 10 } = req.body;

    if (!genre) {
        return res.status(400).json({ message: 'Genre is required' });
    }

    const offset = (page - 1) * pageSize;

    const artistesByGenre = await client.$queryRaw`
            SELECT * FROM artistes
            WHERE FIND_IN_SET(${genre}, genre) > 0
            LIMIT ${pageSize} OFFSET ${offset}
        `;


    res.status(200).json({
        status: true,
        artists: artistesByGenre.filter((artist, index, arr) => arr.indexOf(artist) === index)
    })
})

export const getArtistesBySortingMode = expressAsyncHandler(async (req, res, next) => {

    const { filter, page = 1, pageSize = 10 } = req.body;

    if (!filter) {
        return res.status(400).json({ message: 'fiter mode is required' });
    }

    let where = {
        name_: {
            not: '0'
        }
    };

    let artistes = null;
    switch (filter) {
        case 'views':
            artistes = await client.artistes.findMany({
                take: parseInt(pageSize),
                skip: (page - 1) * pageSize,
                distinct: ['id_'],
                orderBy: {
                    views: 'desc',
                },
                where
            })
            break;
        case 'rip':
            break
        case 'a-z':
            artistes = await client.artistes.findMany({
                take: parseInt(pageSize),
                skip: (page - 1) * pageSize,
                distinct: ['id_'],
                orderBy: {
                    name_: 'asc',
                },
                where
            })
            break
        case 'z-a':
            artistes = await client.artistes.findMany({
                take: parseInt(pageSize),
                skip: (page - 1) * pageSize,
                distinct: ['id_'],
                orderBy: {
                    name_: 'desc',
                },
                where
            })
            break;
        case 'y-to-o':
            artistes = await client.artistes.findMany({
                take: parseInt(pageSize),
                skip: (page - 1) * pageSize,
                distinct: ['id_'],
                orderBy: {
                    dob: 'asc',
                },
                where
            })
            break
        case 'o-to-y':
            artistes = await client.artistes.findMany({
                take: parseInt(pageSize),
                skip: (page - 1) * pageSize,
                distinct: ['id_'],
                orderBy: {
                    dob: 'desc',
                },
                where
            })
            break
        case 'birthday':
            const offset = (page - 1) * pageSize;
            artistes = await client.$queryRaw`SELECT * FROM artistes
                WHERE MONTH(dob) = MONTH(CURDATE())
              AND DAY(dob) = DAY(CURDATE())
              ;          
              `
            break
        case 'monthly-listeners':
            artistes = await client.artistes.findMany({
                take: parseInt(pageSize),
                skip: (page - 1) * pageSize,
                distinct: ['id_'],
                orderBy: {
                    monthly_listeners: 'desc',
                },
                where
            })
            break
        case 'recently-updated':
            break;
        case 'social_followers':
            break
        case 'most_photos':
            break
        case 'following':
            break
    }

    if (!artistes) return res.status(400).json({ message: 'Artists not found' });

    res.status(200).json({
        status: true,
        artists: artistes.filter((artist, index, arr) => arr.indexOf(artist) === index)
    })
})

export const getAlbumsBySortingMode = expressAsyncHandler(async (req, res, next) => {

    const { filter, page = 1, pageSize = 10 } = req.body;

    if (!filter) {
        return res.status(400).json({ message: 'fiter mode is required' });
    }

    let where = {
        artist_id: {
            not: 0
        }
    };

    let albums = null;
    switch (filter) {
        case 'tracks':          
            albums = await client.albums.findMany({
                take: parseInt(pageSize),
                skip: (page - 1) * pageSize,
                orderBy: {
                    tracks_manuel: 'desc',
                },
                where
            })
            break;
        case 'duration':
            albums = await client.albums.findMany({
                take: parseInt(pageSize),
                skip: (page - 1) * pageSize,
                distinct: ['id_'],
                orderBy: {
                    duration_manuel: 'desc',
                },
                where
            })
            break
        case 'recent_first':
            albums = await client.albums.findMany({
                take: parseInt(pageSize),
                skip: (page - 1) * pageSize,
                distinct: ['id_'],
                orderBy: {
                    release_date: 'desc',
                },
                where
            })
            break;
        case 'oldest_first':
            albums = await client.albums.findMany({
                take: parseInt(pageSize),
                skip: (page - 1) * pageSize,
                distinct: ['id_'],
                orderBy: {
                    release_date: 'asc',
                },
                where
            })
            break
        case 'most_popular_artist':
            albums = await client.albums.findMany({
                take: parseInt(pageSize),
                skip: (page - 1) * pageSize,
                distinct: ['id_'],
                where
            })
            break
    }

    if (!albums) return res.status(400).json({ message: 'Albums not found' });

    res.status(200).json({
        status: true,
        albums: albums.filter((artist, index, arr) => arr.indexOf(artist) === index)
    })
})

export const getArtistesByfilter = expressAsyncHandler(async (req, res, next) => {
    const { gender, ageFilter, groupType, pageSize = 10, page = 1 } = req.body;
    let sqlQuery = 'SELECT * FROM artistes WHERE 1=1';
    // Gender filter
    if (gender) {
        sqlQuery += ` AND gender = '${gender}'`; // Ensure gender values are sanitized or validated
    }

    // Group type filter
    if (groupType) {
        sqlQuery += ` AND group_type = '${groupType}'`; // Validate/sanitize input
    }

    // Age filter (this example uses MySQL TIMESTAMPDIFF, adjust for your DBMS)
    if (ageFilter) {
        const currentYear = new Date().getFullYear();
        switch (ageFilter) {
            case '20>age':
                sqlQuery += " AND TIMESTAMPDIFF(YEAR, dob, CURDATE()) < 20";
                break;
            case '30-40':
                sqlQuery += " AND TIMESTAMPDIFF(YEAR, dob, CURDATE()) BETWEEN 30 AND 40";
                break;
            case '20-30':
                sqlQuery += " AND TIMESTAMPDIFF(YEAR, dob, CURDATE()) BETWEEN 20 AND 30";
                break;
            case '40<age':
                sqlQuery += " AND TIMESTAMPDIFF(YEAR, dob, CURDATE()) > 40";
                break;
        }
    }
    let baseQuery = Prisma.raw(sqlQuery);
    const offset = (page - 1) * pageSize;


    const artists = await client.$queryRaw(baseQuery, pageSize, offset);

    if (artists.length === 0) {
        return res.status(404).json({ message: 'No artists found with the specified filters.' });
    }

    res.json({ status: true, artists });
})


export const getArtist = expressAsyncHandler(async (req, res, next) => {
    const { artist_id } = req.params
    const artist = await getArtistById(artist_id);
    if (!artist) return next({ message: 'artist could not be found', status: 404 })

    // let artistSongs = await getArtistsSongs(artist.id_)

    res.status(200).json({
        status: true,
        artist,
        // songs: artistSongs
    })
})

export const getArtistesBySearch = expressAsyncHandler(async (req, res, next) => {
    const { search } = req.body
    console.log(search);
    const artists = await client.artistes.findMany({
        where: {
            name_: {
                contains: search.toLowerCase()
            },
        },
    });
    console.log(artists.length);
    if (!artists) return next({ message: 'artist could not be found', status: 404 })

    res.status(200).json({
        status: true,
        artists,
    })
})

export const getAlbumsBySearch = expressAsyncHandler(async (req, res, next) => {
    const { search } = req.body

    const albums = await client.albums.findMany({
        where: {
            name_: {
                contains: search.toLowerCase()
            },
        },
    });
    console.log(albums.length);
    if (!albums) return next({ message: 'artist could not be found', status: 404 })

    res.status(200).json({
        status: true,
        albums,
    })
})



export const getAlbums = expressAsyncHandler(async (req, res, next) => {
    const { page, pageSize, query } = req.query
    const albums = await client.albums.findMany({
        take: parseInt(pageSize),
        skip: (page - 1) * pageSize,
        distinct: ['name_'],
        where: {
            name_: {
                contains: query,
                not: 'Other'
            }
        }
    });


    res.status(200).json({
        status: true,
        albums: albums.filter((album, index, arr) => arr.indexOf(album) === index)
    })
})


export const getGallery = expressAsyncHandler(async (req, res, next) => {
    const { page, pageSize, query } = req.query

    const gallery = await client.gallery.findMany({
        take: parseInt(pageSize),
        skip: (page - 1) * pageSize,

    });

    // await Prisma.$queryRwa

    res.status(200).json({
        status: true,
        gallery
    })

})


export const getPodcasts = expressAsyncHandler(async (req, res, next) => {
    const podcasts = await client.po
})

export const addEntry = expressAsyncHandler(async (req, res, next) => {
    const { entry} = req.body

    // const gallery = await client.gallery.findMany({
    //     take: parseInt(pageSize),
    //     skip: (page - 1) * pageSize,

    // });
    // await Prisma.$queryRwa

    res.status(200).json({
        status: true,
        memsage :'added correctly'
    })

})