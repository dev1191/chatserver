const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const MessageSchema = new Schema({
  conversationId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  body: {
    type: String
  },
  channelName: {
    type: String
  },
  guestPost: {
    type: String
  }
},
{
  timestamps: true
});


MessageSchema.pre('save', async function (next) {
    const message = this
    next()
})

module.exports = mongoose.model('Message', MessageSchema);