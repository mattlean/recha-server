const mongoose = require('mongoose')

const schemaType = 'Reply'
const schema = new mongoose.Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now,
      required: true
    },

    comment: {
      type: String,
      required: true
    }
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        const r = ret
        r._id = r._id.toString()
        r.createdAt = r.createdAt.toJSON()
        r.type = schemaType
        return r
      }
    }
  }
)
schema.virtual('type').get(() => schemaType)

module.exports = schema
