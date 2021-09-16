const categModel = require("../models/categoria");
const productSimpleModel = require("../models/producto");
//const tk = require("jsonwebtoken");

module.exports = {
    getAll: async function(req, res, next) {

        try {
            let cat = await categModel.find({})
            //await categModel.populate(cat, {path:"categoria"});
       /* if(req.query.bcat){
            var prodCat = productos.map(p=>{
                var i=0;
                while(p.categoria[i]){
                    if(p.categoria[i].nombre == req.query.bcat){
                        return (p);
                    }
                    i+=1;
                }
                    
            });
            console.log(prodCat)
            res.json({docs:prodCat});
        }*/

        res.status(200).json({docs:cat});
        } catch (error) {
            next(error);
        }

        
    },
    getById:async function(req, res, next){
       try {
        if(req.params.id){
            var cat = await categModel.findOne({}).where({_id:req.params.id});
            await productSimpleModel.populate(cat, {path:"ListProd"});
        }
        res.status(200).json({doc:cat})
       } catch (error) {
           next(error)
       }
    },
    delete: async function(req, res, next){
       try {
        if(req.params.id){
            var cat = await categModel.deleteOne({_id:req.params.id});
        }
        res.status(200).json(cat)
       } catch (error) {
           next(error)
       }
    },
    save: async function(req, res, next){
                    /* Crear Producto*/

                const categoria = new categModel({
                nombre: req.body.name,
                descrip: req.body.descrip,
                cantProd:req.body.cant,
                listProd: req.body.productos
            })

            /* Insertar*/

            let categ = await categoria.save();
            res.json(categ);
    }
}