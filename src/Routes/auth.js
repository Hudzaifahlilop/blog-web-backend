const express = require('express');

const router = express.Router();

const authController = require('../Controller/auth')

router.post('/register', authController.register );

module.exports = router;