var express = require('express');
var path = require('path');
var router = express.Router();
const { v4: uuidv4 } = require('uuid');
var multer = require('multer');

var productControllers = require("../controller/productControllers");

const storage = multer.diskStorage({
    destination: path.join(__dirname, '../public/images'),
    filename: (req, file, cb)=>{
        cb(null, uuidv4() + path.extname(file.originalname))
    }
})
const   upload = multer({
            storage,
            dest: path.join(__dirname, '../public/images'),
            limit: 10000,
            fileFilter: (req, file, cb)=>{
                const filetypes = /|jpeg|jpg|gif|png|/;
                const mimetype = filetypes.test(file.mimeType);
                const nametype = filetypes.test(path.extname(file.originalname));
                console.log("imgsss")
                if(mimetype && nametype){
                    return cb(null, true)
                }
                cb("el archivo debe ser una imagen valida");
            }
        })    

/* GET users listing. */
router.get('/', productControllers.getAll);
router.get('/:id', productControllers.getById);
router.delete('/delete/:id', productControllers.delete);
router.post('/new', upload.array('imgs') , productControllers.save);

module.exports = router;