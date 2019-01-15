import mongoose = require('mongoose')

import Reply = require('./reply')

const schemaType = 'Thread'
const schema = new mongoose.Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now,
      required: true
    },

    subject: {
      type: String,
      trim: true
    },

    comment: {
      type: String,
      required: true
    },

    replies: [Reply]
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        const r = ret
        delete r.__v
        r._id = r._id.toString()
        r.createdAt = r.createdAt.toJSON()
        r.type = schemaType
        return r
      }
    }
  }
)
schema.virtual('type').get(() => schemaType)

export = mongoose.model(schemaType, schema)
