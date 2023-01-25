const { Router } = require('express');
const user = require('./user');
const todo = require('./todo');
const verifyToken = require('../middlewares/verify-token');


const router = Router();


router.use('/user', user);
router.use('/todo', verifyToken, todo);


module.exports = router;