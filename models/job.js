const mongoose = require('mongoose');
const validator =  require('validator');
const slugify = require('slugify');
const geoCoder = require('../utils/geocoder');

const jobSchema = new mongoose.Schema({
    title:{
        type: String,
        required: [true, 'Job title is required!'],
        trim: true,
        maxlength:[100, 'Job title can not be more than 100 characters']
    },
    slug: String,
    description:{
        type: String,
        required: [true, 'Job description is required!'],
        maxlength: [1000, 'Job descriptions can not be more than 1000 characters']
    },
    email: {
        type: String,
        validate: [validator.isEmail, 'Please enter a valid email']
    },
    address:{
        type: String,
        required: [true, 'Please enter your office location']
    },
    // location:{
    //     type: {
    //         type: String,
    //         enum: ['Point']
    //     },
    //     coordinates:{
    //         type: [Number],
    //         index: '2dsphere'
    //     },
    //     formattedAddress: String,
    //     city: String,
    //     state: String,
    //     zipcode: String,
    //     country: String
    // },
    company:{
        type: String,
        required: [true, 'Please enter company name']
    },
    industry:{
        type: [String],
        required: true,
        enum: {
            values: [
                'Business',
                'Information Technology',
                'Banking',
                'Education/Training',
                'Telecommunication',
                'Others'
            ],
            method: 'Please choice correct industry'
        }
    },

    jobType:{
        type: String,
        required: true,
        enum: {
            values: [
                'Permanent',
                'Part time',
                'Internship',
                'Contractual'
            ],
            message: 'Please choice correct job type'
        }
    },

    minEducation:{
        type: String,
        required: true,
        enum: {
            values: [
                'Bachelors',
                'Masters',
                'Phd',
                
            ],
            message: 'Please choice correct option'
        }
    },
    positions: {
        type: Number,
        default: 1
    },
    experience:{
        type: String,
        required: true,
        enum: {
            values: [
                'No Experience',
                'Entry Level',
                '1 Year - 2 Year',
                '5 Year+'
            ],
            message: 'Please choice correct options'
        }
    },
    salary: {
        type: Number,
        required: [true, 'Please enter expected salary for this job!']
    },
    postingDate: {
        type: Date,
        default: Date.now
    },
    lastDate: {
        type: Date,
        default: new Date().setDate(new Date().getDate()+7)
    },
    applicantsApplied:{
        type: [Object],
        select: false
    }

})

jobSchema.pre('save', function(next){
    //creating slug before save into database
    this.slug = slugify(this.title, {lower: true});

    next();
})

//setting up locations
// jobSchema.pre('save', async function(next){
//     const loc = await geoCoder.geocode(this.address);
//     this.location = {
//         type: 'Point',
//         coordinates: [loc[0].longitude, loc[0].latitude],
//         formattedAddress: loc[0].formattedAddress,
//         city: loc[0].city,
//         state: loc[0].stateCode,
//         zipcode: loc[0].zipcode,
//         country: loc[0].countryCode,

//     }
// })
module.exports = mongoose.model('Job', jobSchema);