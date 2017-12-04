import { success, notFound } from '../../services/response/'
import { uri, root } from '../../config'
import { Image } from '.'
import { User } from '../user'
import { sign } from '../../services/jwt'
import { fs } from 'fs'

export const imageUpload = ({ params }, res, next) => {

  var file = res.req.file;
  var body = {};

  if (file) {
    var body = {
      url: uri + 'images/',
      thumb: uri + 'thumbs/',
      tag: file.originalname.split('.')[0],
      extention: file.originalname.split('.')[1],
      name: file.filename
    }
  }
  return Image.create(body)
    .then(image => ({ link: image.url + image.id }))
    .then(success(res, 201))
    .catch((err) => {
      /* istanbul ignore else */
      next(err)
    })
}

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Image.count(query)
    .then(count => Image.find(query, select, cursor)
      .then(images => (images.map((image) => image.view())))
    )
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Image.findById(params.id)
    .then(notFound(res))
    .then((image) => res.download(root + '/src/uploads/images/' + image.name))
    .then(success(res))
    .catch(next)

export const create = ({ bodymen: { body } }, res, next) => {
  return Image.create(body)
    .then((image) => ({ image: image.view(true) }))
    .then(success(res, 201))
    .catch((err) => {
      /* istanbul ignore else */
      next(err)
    })
  }

export const update = ({ bodymen: { body }, params, user }, res, next) => {
  var image = body;
  return Image.findById(params.id)
    .then(notFound(res))
    .then((result) => {
      if (!result) return null
      const isSelfUpdate = image.id === result.id
      if (!isSelfUpdate) {
        res.status(401).json({
          valid: false,
          message: 'You can\'t change other image\'s data'
        })
        return null
      }
      return result
    })
    .then((image) => image ? Object.assign(image, body).save() : null)
    .then((image) => image ? image.view(true) : null)
    .then(success(res))
    .catch(next)
  }

export const destroy = ({ params }, res, next) =>
  Image.findById(params.id)
    .then(notFound(res))
    .then((image) => image ? image.remove() : null)
    .then(success(res, 204))
    .catch(next)
