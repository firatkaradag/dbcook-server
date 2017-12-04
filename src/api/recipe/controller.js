import { success, notFound } from '../../services/response/'
import { Recipe } from '.'
import { User } from '../user'
import { sign } from '../../services/jwt'

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Recipe.count(query)
    .then(count => Recipe.find(query, select, cursor)
      .then(recipes => ({
        rows: recipes.map((recipe) => recipe.view()),
        count
      }))
    )
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Recipe.findById(params.id)
    .then(notFound(res))
    .then((recipe) => recipe ? recipe.view(true) : null)
    .then(success(res))
    .catch(next)

export const create = ({ bodymen: { body } }, res, next) => {
  console.log("body: ", body);
  return Recipe.create(body)
    .then(recipe => {
      console.log("recipee: ", recipe);
      sign(recipe.id)
        .then((token) => ({ token, recipe: recipe.view(true) }))
        .then(success(res, 201))
    })
    .catch((err) => {
      /* istanbul ignore else */
      if (err.name === 'MongoError' && err.code === 11000) {
        res.status(409).json({
          valid: false,
          param: 'email',
          message: 'email already registered'
        })
      } else {
        next(err)
      }
    })
  }

export const update = ({ bodymen: { body }, params, user }, res, next) => {
  var recipe = body;
  return Recipe.findById(params.id)
    .then(notFound(res))
    .then((result) => {
      if (!result) return null
      const isAdmin = user.role === 'author'
      const isSelfUpdate = recipe.id === result.id
      if (!isSelfUpdate && !isAdmin) {
        res.status(401).json({
          valid: false,
          message: 'You can\'t change other recipe\'s data'
        })
        return null
      }
      return result
    })
    .then((recipe) => recipe ? Object.assign(recipe, body).save() : null)
    .then((recipe) => recipe ? recipe.view(true) : null)
    .then(success(res))
    .catch(next)
  }

export const destroy = ({ params }, res, next) =>
  Recipe.findById(params.id)
    .then(notFound(res))
    .then((recipe) => recipe ? recipe.remove() : null)
    .then(success(res, 204))
    .catch(next)
