const express  = require('express');
const router = express.Router();
const {getAllJobs, postAJob} = require('../controllers/jobsController');

router.get('/jobs', getAllJobs);
router.post('/job/new', postAJob);





module.exports = router