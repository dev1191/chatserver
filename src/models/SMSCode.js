const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const smscodeSchema = mongoose.Schema({
	users:[{ type: Schema.Types.ObjectId, ref: 'User' }],
    code: {
        type: Number,
        trim:true
    },
    status:{
    	type:Number,
    	max:1,
    	min:0,
        default:0
    },
    created_at:{
        type:Date,
        default: Date.now
    },

  });

 
smscodeSchema.statics.findByID = async (code,user) => {
    var ObjectId = mongoose.Types.ObjectId;
    var query = { users: new ObjectId(user._id)};
    var update = {code: code};
     const smscode = await mongoose.model('Smscode').findOneAndUpdate(query,update,{new: true});
        return smscode;
};


smscodeSchema.statics.findByCode = async (code,user) => {
    // Search for a user by email and password.
	var ObjectId = mongoose.Types.ObjectId;
	var query = { code:code,users: new ObjectId(user[0]._id)};
	var update = {status:1};
    const smscode = await  mongoose.model('Smscode').findOneAndUpdate(query,update,{new: true});
    console.log(smscode);
    if(!smscode) {
        throw new Error({ error: 'Invalid otp credentials' })
    }

    if (smscode.code != code) {
    	  throw new Error({ error: 'Invalid otp credentials' })
    }
 	return smscode;   
}

smscodeSchema.statics.reSendCode = async (user,newcode) => {

	var ObjectId = mongoose.Types.ObjectId;
	var query = { users: new ObjectId(user[0]._id)};
	var update = {code:newcode,status:1,created_at:new Date()};
	const sendcode = await  mongoose.model('Smscode').findOneAndUpdate(query,update);
   return sendcode;
}


const SMSCode = mongoose.model('Smscode', smscodeSchema)


module.exports = SMSCode;