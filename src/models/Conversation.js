const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const ConversationSchema = new Schema({
  senderID: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  recipientID: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date }
});


ConversationSchema.pre('save', async function (next) {
    // Hash the password before saving the user model
    const user = this
    next()
})


module.exports = mongoose.model('Conversation', ConversationSchema);

