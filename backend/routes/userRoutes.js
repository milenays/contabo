const express = require('express');
const { registerUser, authUser } = require('../controllers/userControllers');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);

module.exports = router;
