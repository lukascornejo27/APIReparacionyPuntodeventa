var express = require('express');
var router = express.Router();

var categoriaControllers = require("../controller/categoriaControllers");

/* GET users listing. */
router.get('/', categoriaControllers.getAll);
router.get('/:id', categoriaControllers.getById);
router.delete('/delete/:id', categoriaControllers.delete);
router.post('/save', categoriaControllers.save);

module.exports = router;