const Job = require('../models/job');
const geoCoder = require('../utils/geocoder');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ApiFilters = require('../utils/apiFilters');

//get all jobs
const getAllJobs=async(req,res,next)=>{

    const apiFilters = new ApiFilters(Job.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .searchByQuery()
            .pagination()

    const jobs = await apiFilters.query;

    res.status(200).json({
        success: true,
        result: jobs.length,
        data: jobs
    })
}

//get a job by ID and slug
const getAJob = async(req,res,next)=>{
    const job = await Job.find({$and: [{_id: req.params.id}, {slug: req.params.slug}]})

    if(!job){
        return next(new ErrorHandler('Job was not found!', 404));
    }

    res.status(200).json({
        success: true,
        data: job
    })

}

//create a new job
const postAJob = catchAsyncErrors(
    async(req, res, next)=>{
        const job = await Job.create(req.body);
    
        res.status(200).json({
            success: true,
            message: 'Job posted',
            data: job
        })
    }
)


//update a job by ID
const updateJob = async(req, res, next)=>{
    let job = await Job.findById(req.params.id);

    if(!job){
        return res.status(404).json({
            success: false,
            message: "Job was not found!"
        })
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        message: "Job updated successfully!",
        data: job
    })

}


//delete a job
const deleteJobById = async(req, res, next)=>{
    let job = await Job.findById(req.params.id);
    
    if (!job){
        return res.status(404).json({
            success: false,
            message: "Job not found!"
        })
    }

    job = await Job.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        message: "Job deleted successfully!"
    })
}


//search jobs with radius
const getJobsInRadius= async(req, res, next)=>{
    const {zipcode, distance} = req.params;

    //getting longitude and latitude from geocoder
    const loc = await geoCoder.geocode(zipcode);
    const latitude = loc[0].latitude;
    const longitude = loc[0].longitude;
    const radius = distance / 3963;

    const jobs = await Job.find({
        location: {$geoWithin: {$centerSphere: [[longitude, latitude], radius]}}
    });

    res.status(200).json({
        success: true,
        results: jobs.length,
        data: jobs
    })
    
}

//get job stats
const getJobStats = async(req, res, next)=>{
    const stats = await Job.aggregate([
        {
            $match: {
                $text: {
                    $search: "\""+req.params.topic+"\""
                }
            }
        },
        {
            $group: {
                _id: {$toUpper: '$experience'},
                totalJobs: {$sum: 1},
                avgPosition: {$avg: '$positions'},
                avgSalary: {$avg: '$salary'},
                minSalary: {$min: '$salary'},
                maxSalary: {$max: '$salary'}
            }
        }
    ])
}



module.exports = {
    getAllJobs,
    postAJob,
    getJobsInRadius,
    updateJob,
    deleteJobById,
    getAJob,
    getJobStats
}