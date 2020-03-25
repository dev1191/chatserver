const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')



const GroupSchema = new Schema({
  GroupName: {
    type: String,
    required: true
  },
  image:{
  	type:String,
  	default:"group.jpg"
  },
  date:{
  	type: Date,
  	default:Date.now
  },
   users: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});


GroupSchema.pre('save', async function (next) {
    const message = this
    next()
})

module.exports = mongoose.model('Group', GroupSchema);