const express = require('express');
const router = express.Router();
const {createCollege,getCollegeInternsDetails } = require('../controller/collegeController')
const {createIntern} = require('../controller/internController')



router.post('/functionup/colleges', createCollege)
router.post('/functionup/interns', createIntern)
router.get('/functionup/collegeDetails',getCollegeInternsDetails )



module.exports = router;