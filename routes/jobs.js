const express  = require('express');
const router = express.Router();
const {getAllJobs, postAJob, getJobsInRadius, updateJob, deleteJobById, getAJob, getJobStats} = require('../controllers/jobsController');

router.get('/jobs', getAllJobs);
router.get('/job/:id/:slug', getAJob);
router.get('/jobs/:topic', getJobStats);
router.get("/jobs/:zipcode/:distance", getJobsInRadius);
router.post('/job/new', postAJob);
router.put('/job/:id', updateJob);
router.delete('/job/:id', deleteJobById);



module.exports = router