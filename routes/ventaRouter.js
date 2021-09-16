var express = require('express');
var router = express.Router();

var ventaControllers = require("../controller/ventaControllers");

/* GET users listing. */
router.get('/', ventaControllers.getAll);
router.get('/:id', ventaControllers.getById);
router.put('/update/:id',ventaControllers.update);
router.delete('/delete/:id', ventaControllers.delete);
router.post('/new', ventaControllers.save);

module.exports = router;