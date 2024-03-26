const Job = require('../models/job');
//get all jobs
const getAllJobs=async(req,res,next)=>{
    const jobs = await Job.find();

    res.status(200).json({
        success: true,
        result: jobs.length,
        data: jobs
    })
}


//create a new job
const postAJob=async(req, res, next)=>{
    const job = await Job.create(req.body);

    res.status(200).json({
        success: true,
        message: 'Job posted',
        data: job
    })
}




module.exports = {
    getAllJobs,
    postAJob
}