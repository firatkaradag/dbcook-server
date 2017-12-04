import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { password as passwordAuth, master, token } from '../../services/passport'
import { index, show, create, update, destroy } from './controller'
import { schema } from './model'
export Recipe, { schema } from './model'

const router = new Router()
const { author, title, content, abstract, cover, thumbnail, images, type, badges } = schema.tree

/**
 * @api {get} /recipes Retrieve recipes
 * @apiName RetrieveRecipes
 * @apiGroup Recipe
 * @apiPermission admin, author
 * @apiParam {String} access_token Recipe access_token.
 * @apiUse listParams
 * @apiSuccess {Object[]} recipes List of recipes.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 Admin access only.
 * { required: true, roles: ['admin','author'] }
 */
router.get('/',
  token({ required: true, roles: ['author'] }),
  query(),
  index)

/**
 * @api {get} /recipes/:id Retrieve recipe
 * @apiName RetrieveRecipe
 * @apiGroup Recipe
 * @apiPermission public
 * @apiSuccess {Object} recipe Recipe's data.
 * @apiError 404 Recipe not found.
 */
router.get('/:id',
  show)

/**
 * @api {post} /recipes Create recipe
 * @apiName CreateRecipe
 * @apiGroup Recipe
 * @apiPermission master
 * @apiParam {String} access_token Master access_token.
 * @apiParam {String} [author] Recipe's author.
 * @apiParam {String} [title] Recipe's title.
 * @apiParam {String} [content] Recipe's content.
 * @apiParam {String} [cover] Recipe's cover.
 * @apiParam {String} [thumbnail] Recipe's thumbnail.
 * @apiParam {String} [images] Recipe's images.
 * @apiParam {String} [type] Recipe's type.
 * @apiParam {String} [badges] Recipe's badges.
 * @apiSuccess (Sucess 201) {Object} recipe Recipe's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 Master access only.
 */
router.post('/',
  master(),
  body({ author, title, content, abstract, cover, thumbnail, images, type, badges }),
  create)

/**
 * @api {put} /recipes/:id Update recipe
 * @apiName UpdateRecipe
 * @apiGroup Recipe
 * @apiPermission recipe
 * @apiParam {String} access_token Recipe access_token.
 * @apiParam {String} [author] Recipe's author.
 * @apiParam {String} [title] Recipe's title.
 * @apiParam {String} [content] Recipe's content.
 * @apiParam {String} [cover] Recipe's cover.
 * @apiParam {String} [thumbnail] Recipe's thumbnail.
 * @apiParam {String} [images] Recipe's images.
 * @apiParam {String} [type] Recipe's type.
 * @apiParam {String} [badges] Recipe's badges.
 * @apiSuccess {Object} recipe Recipe's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 Current recipe or admin access only.
 * @apiError 404 Recipe not found.
 */
router.put('/:id',
  token({ required: true }),
  body({ author, title, content, cover, thumbnail, images, type, badges }),
  update)

/**
 * @api {delete} /recipes/:id Delete recipe
 * @apiName DeleteRecipe
 * @apiGroup Recipe
 * @apiPermission admin
 * @apiParam {String} access_token Recipe access_token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 401 Admin access only.
 * @apiError 404 Recipe not found.
 */
router.delete('/:id',
  token({ required: true, roles: ['admin', 'author'] }),
  destroy)

export default router
