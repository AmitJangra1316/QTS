const express = require('express');
const router = express.Router();
const projectcontroller = require('../controllers/projectcontroller');
const auth = require('../authmiddle');

router.get('/projects/:id',projectcontroller.viewproject);
router.post('/projects/:id/assign', projectcontroller.assignUsersToProject);
router.get('/projects',auth,projectcontroller.allproject);
router.post('/projects/add',projectcontroller.addproject);


router.delete('/projects/:id',auth,projectcontroller.delete);




module.exports = router;
