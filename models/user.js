const mongoose = require('mongoose');
const validator  = require('validator');
const bcript = require('bcryptjs');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        validate: [validator.isEmail, 'Please enter a valid email']
    },
    role: {
        type: String,
        enum: {
            values: ['user', 'employer'],
            message: 'Please choice correct options'
        },
        required: [true, 'Please choice correct role'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [5, 'Password must be at least 5 characters'],
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date

})

//encrypting password before saving
userSchema.pre('save', async function(next){
    this.password = await bcript.hash(this.password, 10);
})

//return JSON web token
userSchema.methods.getJwtToken = function(){
   return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE_TIME
    })
}

//compare password
userSchema.methods.comparePassword = async function(password){
    return await bcript.compare(password, this.password)
}






module.exports = mongoose.model('User', userSchema);