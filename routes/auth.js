const express = require('express');

const {register, login, getMe, logout, removeUser} = require('../controllers/auth');

const router = express.Router();

const {protect, authorize} = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect,getMe);
router.get('/logout',logout);
router.delete('/:id', protect, authorize('admin'), removeUser);

module.exports = router;