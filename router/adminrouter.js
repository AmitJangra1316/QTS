const express = require('express');
const router = express.Router();
const loginController = require('../controllers/admincontroller');
const auth = require('../authmiddle');

router.post('/login', loginController.login);
router.get('/login',loginController.readlogin);

router.get('/user',auth, loginController.readuser);
router.get('/projects',auth,loginController.readproject);

router.get('/logout',auth,loginController.logout);

router.post('/signup',loginController.signup);
router.get('/signup',loginController.readsignup);

router.get('/readadmin',loginController.readadmin);


module.exports = router;
