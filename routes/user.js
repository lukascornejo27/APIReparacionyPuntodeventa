var express = require('express');
var router = express.Router();

var userControllers = require("../controller/userControllers");

/* GET users listing. */
router.post('/regist', userControllers.save);
router.post('/login', userControllers.login);
router.delete('/delete/:user', userControllers.delete);

module.exports = router;