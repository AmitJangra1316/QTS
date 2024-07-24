const express = require('express');
const router = express.Router();
const loginController = require('../controllers/usercontroller');
const clientauth = require('../clientmiddle');

router.post('/login',loginController.login);
router.get('/login',loginController.readlogin);

router.get('/logout',clientauth,loginController.logout);

router.post('/signup',loginController.signup);
router.get('/signup',loginController.readsignup);

router.delete('/:id',clientauth,loginController.delete);


module.exports = router;
