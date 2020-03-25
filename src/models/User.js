const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const userSchema = mongoose.Schema({
    fullname: {
        type: String,
        trim: true,
        default:""
    },
    cc: {
        type: String,
    },
    phone: {
        type: String,
        unique: true,
        trim:true
    },
    avatar:{
        type:String,
        trim:true,
        default:""
    },
    is_activated:{
        type:Number,
        min:0,
        max:1,
        default:0
    },
    created_at:{
        type:Date,
        default: Date.now
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.pre('save', async function (next) {
    // Hash the password before saving the user model
    const user = this
    // if (user.isModified('password')) {
    //     user.password = await bcrypt.hash(user.password,6)
    // }

    next()
})

userSchema.methods.generateAuthToken = async function() {
    // Generate an auth token for the user
    const user = this
    const token = jwt.sign({_id: user._id}, process.env.JWT_KEY)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}


userSchema.statics.findByCredentials = async (email, password) => {
    // Search for a user by email and password.
    const user = await User.findOne({ email} )
    if (!user) {
        throw new Error({ error: 'Invalid login credentials' })
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
        throw new Error({ error: 'Invalid login credentials' })
    }
    return user
}

const User =  mongoose.model('User', userSchema)

module.exports = User