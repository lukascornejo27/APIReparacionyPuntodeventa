const userModel = require("../models/user");
const tk = require("jsonwebtoken");

module.exports = {
    login: async function(req, res, next) {

        try {
        let user = await userModel.findOne({ user:req.body.user,pass:req.body.pass});
            if(user){
                const token= tk.sign({usuario: user},"12345",{expiresIn:"1h"}) 
                res.status(201).json({mensaje:"Bienvenido/a "+user.nombre, token:token});
            }
            else {
                res.json({mensaje: "usuario no registrado"});
            }
        } catch (error) {
            next(error);
        }

        
    },
    delete: async function(req, res, next){
       try {
        if(req.params.user){
            var user = await userModel.deleteOne({user:req.params.user});
        }
        res.status(200).json(user)
       } catch (error) {
           next(error)
       }
    },
    save: async function(req, res, next){
        /* Crear registro*/
        try {
            const newUser = new userModel({
                "nombre" : req.body.nombre,
                "apellido" : req.body.apellido,
                "user" : req.body.user,
                "pass" : req.body.pass,
                "email" : req.body.email,
                /*
                "celular" : req.body.phone,
                "etiqueta" : req.body.tags,
                "direcciones" : req.body.dir,
                "pedidos" : req.body.ped*/
            })

            /* Insertar*/

            let user = await newUser.save();
            res.json(user);

        } catch (error) {
            next(error)
        }
    }
}