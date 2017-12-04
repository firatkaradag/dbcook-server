import mongoose, { Schema } from 'mongoose'
import mongooseKeywords from 'mongoose-keywords'
import { env } from '../../config'

const types = ['image'];
const extentions = ['jpg', 'png', 'jpeg'];

const imageSchema = new Schema({

  url: {
    type: String,
    required: true,
    index: true
  },
  thumb: {
    type: String
  },
  tag: {
    type: String
  },
  extention: {
    type: String,
    enum: extentions,
    default: 'jpg'
  },
  type: {
    type: String,
    enum: types,
    default: 'image'
  },
  name: {
    type: String
  }
}, {
  timestamps: true
})

imageSchema.pre('save', function (next) {
    next()
})

imageSchema.methods = {
  view (full) {
    let view = {}
    let fields = ['id', 'url', 'thumb', 'tag', 'name']

    if (full) {
      fields = [...fields, 'extention', 'createdAt', 'updatedAt']
    }

    fields.forEach((field) => { view[field] = this[field] })

    return view
  }
}

imageSchema.statics = {
  extentions
}

imageSchema.plugin(mongooseKeywords, { paths: ['url', 'thumb'] })

const model = mongoose.model('Image', imageSchema)

export const schema = model.schema
export default model
