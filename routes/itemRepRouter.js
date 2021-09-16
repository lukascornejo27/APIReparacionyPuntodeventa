var express = require('express');
var router = express.Router();

var controller = require("../controller/itemRepControllers");

/* GET users listing. */
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.delete('/delete/:id', controller.delete);
router.put('/update/:id', controller.update);
router.post('/new', controller.save);

module.exports = router;