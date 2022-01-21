const mongoose = require('mongoose')
const artSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  cloudinary_id: {
    type: String,
  },
})

module.exports = mongoose.model('Art', artSchema)
