'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth-controller');
const authService = require('../services/auth-service');

router.post('/authenticate', controller.authenticate);
router.post('/refreshToken', authService.authorize , controller.refreshToken );

module.exports = router;