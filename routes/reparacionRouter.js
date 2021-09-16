var express = require('express');
var router = express.Router();

var repracionControllers = require("../controller/reparacionControllers");

/* GET users listing. */
router.get('/', repracionControllers.getAll);
router.get('/:id', repracionControllers.getById);
router.put('/update/:id',repracionControllers.update);
router.delete('/delete/:id', repracionControllers.delete);
router.post('/new', repracionControllers.save);

module.exports = router;