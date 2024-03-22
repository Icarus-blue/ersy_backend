import { Router } from 'express'
import * as VideoController from '../controllers/data.controller.js'
import { verifyToken } from '../middlewares/verifyToken.js'

const router = Router()

/**
 * @swagger
 * /data/videos:
 *   get:
 *     summary: Retrieve a list of music videos
 *     tags: [Videos]
 *     description: This endpoint returns a list of music videos, supporting filtering by query, album ID, and category, as well as pagination.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: Page number for pagination (default is 1).
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         required: false
 *         description: Number of items per page for pagination (default is 10).
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: false
 *         description: Query string to search in video titles.
 *       - in: query
 *         name: album_id
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filter videos by album ID.
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         required: false
 *         description: Special category filter, e.g., 'trending' to filter videos by views.
 *     responses:
 *       200:
 *         description: A list of music videos based on the query parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 videos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Video'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 * components:
 *   schemas:
 *     Video:
 *       type: object
 *       properties:
 *         id_:
 *           type: integer
 *         title:
 *           type: string
 *         artist_id:
 *           type: integer
 *         artist_name:
 *           type: string
 *         video_id:
 *           type: string
 *         duration:
 *           type: integer
 *         views:
 *           type: string
 *         release_date:
 *           type: string
 *           format: date-time
 *         description_:
 *           type: string
 *         img:
 *           type: string
 *         category:
 *           type: string
 */

/**
 * @swagger
 * /data/artists:
 *   get:
 *     summary: Retrieve a list of artistes
 *     tags: [Artistes]
 *     description: This endpoint returns a list of artistes, supporting search by artist name and pagination.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         required: false
 *         description: Page number for pagination.
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         required: false
 *         description: Number of items per page for pagination.
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: false
 *         description: Query string to search artistes by name.
 *     responses:
 *       200:
 *         description: A list of artistes based on the query parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 artists:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_:
 *                         type: integer
 *                       name_:
 *                         type: string
 *                       nick_names:
 *                         type: string
 *                       url_:
 *                         type: string
 *                       verification_status:
 *                         type: boolean
 *                       dob:
 *                         type: string
 *                         format: date
 *                       dob_format:
 *                         type: string
 *                       birthplace:
 *                         type: string
 *                       img_:
 *                         type: string
 *                       alternate_name:
 *                         type: string
 *                       occupation:
 *                         type: string
 *                       genre:
 *                         type: string
 *                       category:
 *                         type: string
 *                       gender:
 *                         type: string
 *                       label:
 *                         type: string
 *                       label_id:
 *                         type: integer
 *                       group_type:
 *                         type: string
 *                       living_status:
 *                         type: string
 *                       youtube:
 *                         type: string
 *                       main_channel_id:
 *                         type: string
 *                       facebook:
 *                         type: string
 *                       instagram:
 *                         type: string
 *                       wikipedia:
 *                         type: string
 *                       genius_url:
 *                         type: string
 *                       twitter:
 *                         type: string
 *                       website:
 *                         type: string
 *                       soundcloud:
 *                         type: string
 *                       facebook_count:
 *                         type: integer
 *                       instagram_count:
 *                         type: integer
 *                       soundcloud_count:
 *                         type: integer
 *                       twitter_count:
 *                         type: integer
 *                       youtube_count:
 *                         type: integer
 *                       spotify_count:
 *                         type: integer
 *                       views:
 *                         type: string
 *                       monthly_listeners:
 *                         type: string
 */

/**
 * @swagger
 * /data/albums:
 *   get:
 *     summary: Retrieve a list of albums
 *     tags: [Albums]
 *     description: This endpoint returns a list of albums, supporting filtering by album name and pagination.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         required: false
 *         description: Page number for pagination.
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         required: false
 *         description: Number of albums per page for pagination.
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: false
 *         description: Query string to search in album names.
 *     responses:
 *       200:
 *         description: A list of albums based on the query parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 albums:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Album'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 * components:
 *   schemas:
 *     Album:
 *       type: object
 *       properties:
 *         id_:
 *           type: integer
 *         artist_id:
 *           type: integer
 *         artist_name:
 *           type: string
 *         artist_url:
 *           type: string
 *         name_:
 *           type: string
 *         label:
 *           type: string
 *         type_:
 *           type: string
 *         release_date:
 *           type: string
 *           format: date
 *         img_:
 *           type: string
 *         tracks_in:
 *           type: integer
 *         tracks_manuel:
 *           type: integer
 *         duration_manuel:
 *           type: integer
 *         apple_music:
 *           type: string
 *         spotify:
 *           type: string
 *         amazon:
 *           type: string
 *         youtube_music:
 *           type: string
 *         datpiff:
 *           type: string
 *         tidal:
 *           type: string
 */

/**
 * @swagger
 * /gallery:
 *   get:
 *     summary: Retrieve a paginated list of gallery items
 *     tags: [Gallery]
 *     description: This endpoint returns a paginated list of gallery items, optionally filtered by a query parameter.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         required: false
 *         description: Page number for pagination.
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         required: false
 *         description: Number of items per page for pagination.
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: false
 *         description: (Optional) Query string to filter the gallery items.
 *     responses:
 *       200:
 *         description: A paginated list of gallery items.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 gallery:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/GalleryItem'
 *       400:
 *         description: Bad request, such as invalid query parameters.
 *       500:
 *         description: Server error.
 * components:
 *   schemas:
 *     GalleryItem:
 *       type: object
 *       properties:
 *         id_:
 *           type: integer
 *         artist_id:
 *           type: integer
 *         source0:
 *           type: string
 *         source:
 *           type: string
 *         url_:
 *           type: string
 *         thumbnail_url:
 *           type: string
 *         width:
 *           type: integer
 *         height:
 *           type: integer
 *         date_:
 *           type: string
 *           format: date-time
 *         location:
 *           type: string
 *         date_taken:
 *           type: string
 *           format: date-time
 */


router.get('/videos', VideoController.getMusicVideos)
router.get('/artists', VideoController.getArtistes)
router.get("/artists/:artist_id", VideoController.getArtist)
router.get('/albums', VideoController.getAlbums)
router.get('/gallery', VideoController.getGallery)
export default router