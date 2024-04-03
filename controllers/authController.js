const User = require('../models/user');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');


//register a user
const registerUser = catchAsyncErrors(async(req, res, next)=>{
    const {name, email, password, role} = req.body;

    const user = await User.create({
        name,
        email,
        password,
        role
    });

    const token = user.getJwtToken();

    res.status(200).json({
        success: true,
        message: 'user is registered',
        token
    })
})


//login user
const loginUser = catchAsyncErrors(async(req, res, next)=>{
    const{email , password} = req.body;

    if(!email || !password){
        next(new ErrorHandler('Please enter email and password', 400))
    }

    const user = await User.findOne({email}).select('+password');

    if(!user){
        return next(new ErrorHandler('Invalid email or password', 401))
    }

    //checking password 
    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler('Invalid email or password', 401))
    }

    //creating token
    const token = user.getJwtToken();

    res.status(200).json({
        success: true,
        token
    })
})




module.exports = {
    registerUser,
    loginUser
}