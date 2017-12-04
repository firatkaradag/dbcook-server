import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { password as passwordAuth, master, token } from '../../services/passport'
import { index, show, create, update, destroy, imageUpload } from './controller'
import { schema } from './model'
import multer from 'multer'

export Image, { schema } from './model'

const upload = multer({ dest: './src/uploads/images/' })
const router = new Router()
const { url, thumb, tag, name } = schema.tree

/**
 * @api {get} /images Retrieve images
 * @apiName RetrieveImages
 * @apiGroup Image
 * @apiPermission admin, author
 * @apiParam {String} access_token Image access_token.
 * @apiUse listParams
 * @apiSuccess {Object[]} images List of images.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 Admin access only.
 * { required: true, roles: ['admin','author'] }
 */
router.get('/',
  token({ required: true }),
  query(),
  index)

/**
 * @api {get} /images/:id Retrieve image
 * @apiName RetrieveImage
 * @apiGroup Image
 * @apiPermission public
 * @apiSuccess {Object} image Image's data.
 * @apiError 404 Image not found.
 */
router.get('/:id',
  show)

/**
 * @api {post} /images Create image
 * @apiName CreateImage
 * @apiGroup Image
 * @apiPermission master
 * @apiParam {String} access_token Master access_token.
 * @apiParam {String} [author] Image's author.
 * @apiParam {String} [title] Image's title.
 * @apiParam {String} [content] Image's content.
 * @apiParam {String} [cover] Image's cover.
 * @apiParam {String} [thumbnail] Image's thumbnail.
 * @apiParam {String} [images] Image's images.
 * @apiParam {String} [type] Image's type.
 * @apiParam {String} [badges] Image's badges.
 * @apiSuccess (Sucess 201) {Object} image Image's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 Master access only.
 */
router.post('/',
  master(),
  body({ url, thumb, tag, name  }),
  create)

/**
 * @api {post} /images/upload Create image
 * @apiName CreateImage
 * @apiGroup Image
 * @apiPermission master
 * @apiParam {String} access_token Master access_token.
 * @apiParam {String} [author] Image's author.
 * @apiParam {String} [title] Image's title.
 * @apiParam {String} [content] Image's content.
 * @apiParam {String} [cover] Image's cover.
 * @apiParam {String} [thumbnail] Image's thumbnail.
 * @apiParam {String} [images] Image's images.
 * @apiParam {String} [type] Image's type.
 * @apiParam {String} [badges] Image's badges.
 * @apiSuccess (Sucess 201) {Object} image Image's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 Master access only.
 */
  router.post('/upload',
    token(),
    upload.single('file'),
    imageUpload)

/**
 * @api {put} /images/:id Update image
 * @apiName UpdateImage
 * @apiGroup Image
 * @apiPermission image
 * @apiParam {String} access_token Image access_token.
 * @apiParam {String} [author] Image's author.
 * @apiParam {String} [title] Image's title.
 * @apiParam {String} [content] Image's content.
 * @apiParam {String} [cover] Image's cover.
 * @apiParam {String} [thumbnail] Image's thumbnail.
 * @apiParam {String} [images] Image's images.
 * @apiParam {String} [type] Image's type.
 * @apiParam {String} [badges] Image's badges.
 * @apiSuccess {Object} image Image's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 Current image or admin access only.
 * @apiError 404 Image not found.
 */
router.put('/:id',
  token({ required: true }),
  body({ url, thumb, tag, name }),
  update)

/**
 * @api {delete} /images/:id Delete image
 * @apiName DeleteImage
 * @apiGroup Image
 * @apiPermission admin
 * @apiParam {String} access_token Image access_token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 401 Admin access only.
 * @apiError 404 Image not found.
 */
router.delete('/:id',
  token({ required: true }),
  destroy)

export default router
