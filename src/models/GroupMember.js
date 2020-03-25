const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')



const GroupMemberSchema = new Schema({
  groups: [{ type: Schema.Types.ObjectId,ref: 'Group'}],
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  role: {type: String,required: true},
  isleft:{ type: Number,min:0,max:1,default:0},
  deleted:{ type: Number,min:0,max:1,default:0}
});

module.exports = mongoose.model('GroupMember', GroupMemberSchema);