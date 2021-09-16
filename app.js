var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var multer = require('multer');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user');
var productsRouter = require('./routes/products');
var categoriaRouter = require('./routes/categoria');
var reparacionRouter = require('./routes/reparacionRouter');
var clieteRouter = require('./routes/clienteAdmRouter');
var empleadoRouter = require('./routes/empleadoAdmRouter');
var insumoRouter = require('./routes/insumoRepRouter');
var itemreparacionRouter = require('./routes/itemRepRouter');
var ventaRouter = require('./routes/ventaRouter');

const tk = require("jsonwebtoken");
var app = express();

/** HEADER INICIO */
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,DELETE,PUT,OPTIONS');
    next();
  });
  app.options("/*", function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With,x-access-token');
    res.send(200);
  });
  /** HEADER FIN */

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//middleware



app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/products',productsRouter);
app.use('/categoria', categoriaRouter);
app.use('/reparacion',reparacionRouter);
app.use('/cliente', clieteRouter);
app.use('/empleado',empleadoRouter);
app.use('/insumo', insumoRouter);
app.use('/item-reparacion', itemreparacionRouter);
app.use('/venta', ventaRouter);

function validateUser(req,res,next){
  console.log(req.app.get('secretKey'))
  tk.verify(req.headers['x-access-token'],'12345',function(err,decoded){
    if(err){
      res.json({mensaje:err.message});
    }
    else {
      req.body.userToken = decoded;
      next();
    }
  })
}

module.exports = app;
