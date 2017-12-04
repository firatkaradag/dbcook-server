import crypto from 'crypto'
import bcrypt from 'bcrypt'
import mongoose, { Schema } from 'mongoose'
import mongooseKeywords from 'mongoose-keywords'
import { env } from '../../config'

const types = ['general'];

const recipeSchema = new Schema({
  author: {
    type : Schema.Types.ObjectId, ref: 'User'
  },
  title: {
    type: String,
    required: true,
    index: true
  },
  content: {
    type: String
  },
  abstract: {
    type: String
  },
  cover: {
    type: String
  },
  thumbnail: {
    type: String
  },
  images: [
    { type: String }
  ],
  type: {
    type: String,
    enum: types,
    default: 'general'
  },
  badges: {
    type: String
  }
}, {
  timestamps: true
})

recipeSchema.pre('save', function (next) {
    next()
})

recipeSchema.methods = {
  view (full) {
    let view = {}
    let fields = ['id', 'author', 'title', 'thumbnail', 'abstract', 'badges']

    if (full) {
      fields = [...fields, 'content', 'cover', 'images', 'type', 'createdAt', 'updatedAt']
    }

    fields.forEach((field) => { view[field] = this[field] })

    return view
  }
}

recipeSchema.statics = {
  types
}

recipeSchema.plugin(mongooseKeywords, { paths: ['author', 'title'] })

const model = mongoose.model('Recipe', recipeSchema)

export const schema = model.schema
export default model
