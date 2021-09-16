const clienteAdministracionModel = require("../models/ADM_cliente");

module.exports = {
    getAll: async function(req,res, next) {

        try {

            var item = await clienteAdministracionModel.find({})
            .sort({nombre:1})

            if(!item){
                res.status(400).json({
                    estado: false,
                    error:error
                })
            }
            else {
                res.status(200).json({
                    estado:true,
                    docs: item
                })
            }
            

        } catch (error) {
            next(error);
        }

        
    },
    getById: async function(req, res, next){
               try {
                   if(req.params.id){
                        await clienteAdministracionModel.find({_id:req.params.id},async function(error, doc){
                            if(error){
                                res.status(400).json({
                                    estado: false,
                                    error:error
                                })
                            }
                            else {
                                res.status(200).json({
                                    estado:true,
                                    docs: doc
                                })
                            }
                        })
                   }
                    
               } catch (error) {
                   next(error)
               }
    },
    update : async function(req,res, next){
        try {
            if(req.params.id){

                const update = {
                    nombre : req.body.nombre,
                    apellido : req.body.apellido,
                    telefono : req.body.telefono,
                    email : req.body.email,
                    categoria: req.body.categoria           
                }

                await clienteAdministracionModel.findOneAndUpdate({
                    _id: req.params.id,
                },
                update,
                {new: true}
                ,
                (err, doc) => {
                    if (err) {
                        res.status(400).json({
                            estado: false,
                            error:err
                        })
                    } else {
                        res.status(200).json({
                            estado:true,
                            doc: doc
                        })
                    }
                });
            }
        } catch (error) {
            next(error)
        }
        
    },
    delete: async function(req,res, next){
        try {
            if(req.params.id){
                await clienteAdministracionModel.deleteOne({
                    _id: req.params.id,
                },
                (err, doc) => {
                    if (err) {
                        res.status(400).json({
                            estado: false,
                            error:err
                        })
                    } else {
                        res.status(200).json({
                            estado: true,
                            doc: doc
                        })
                    }
                });
            }
        } catch (error) {
            next(error)
        }
    
    },
    save: async function(req,res, next){
        try {
                const create = new clienteAdministracionModel({
                    nombre : req.body.nombre,
                    apellido : req.body.apellido,
                    dni: req.body.dni,
                    telefono : req.body.telefono,
                    email : req.body.email,
                    cuenta : undefined,
                    categoria: req.body.categoria 
                });

            await create.save(
            (err, doc) => {
                if (err) {
                    res.status(400).json({
                        estado: false,
                        error:err
                    })
                } else {
                    res.status(200).json({
                        estado: true,
                        doc: doc
                    })
                }
            });
        
        } catch (error) {
            next(error)
        }

    }
}