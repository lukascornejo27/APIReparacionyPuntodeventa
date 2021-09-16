const reparacionModel = require("../models/REP_reparacion");
const dispositivoModel = require("../models/REP_dispositivo");
const itemReparacionModel = require("../models/REP_item_reparacion");
const insumoModel= require("../models/REP_insumo");
const mongoose =  require("mongoose");



module.exports = {
    getAll: async function(req,res, next) {

        try {

            var docs = await reparacionModel.find({})
            .populate({
                path: 'empleado',
                model: 'ADM_empleado',
                select:['nombre','dni']
            })
            .populate({
                path: 'cliente',
                model: 'ADM_cliente',
                select:['nombre','apellido','dni', 'telefono']
            })
            .sort({fecha:1})
            
            
            /* 
            .populate({
                path: 'list_dispositivos',
                populate: {
                    path: 'list_item_reparacion',
                    populate: {
                        path:'item',
                        model: 'REP_item_reparacion'
                    }
                }
                //populate: { path: 'list_item_reparacion', model: 'REP_item_reparacion',
                  //          select:['nombre','precio']}
            })
            */

            //var docs =  await dispositivoModel.populate(docs, {path:"list_items"})
            res.status(200).json({
                estado:true,
                docs: docs
            })
           
        } catch (error) {
            next(error);
        }

        
    },
    getById: async function(req, res, next){
               try {
                   if(req.params.id){
                        var doc = await reparacionModel.findById(req.params.id)
                        .populate({
                            path: 'empleado',
                            model: 'ADM_empleado',
                            select:['nombre','dni']
                        })
                        .populate({
                            path: 'cliente',
                            model: 'ADM_cliente',
                            select:['nombre','apellido','dni', 'telefono']
                        })
                        .populate({
                            path: 'list_dispositivos.list_item_reparacion.item',
                            select:['nombre','precio']
                        })

                        if(!doc){
                            res.status(400).json({
                                estado: false,
                                error:error
                            })
                        }
                        else {
                            doc =  await dispositivoModel.populate(doc, {path:"list_items"});
                            res.status(200).json({
                                estado:true,
                                doc: doc
                            })
                        }
                    
                   }
                    
               } catch (error) {
                   next(error)
               }
    },
    update : async function(req,res, next){
        try {
            if(req.params.id && !req.query.ops){
                const update = {
                    fecha: req.body.fecha,
                    descrip: req.body.descrip,
                    empleado: req.body.empleado,
                    cliente:req.body.cliente
                    //list_items: req.body.list_items
                }
                await reparacionModel.findOneAndUpdate({
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
                        updateDisp(doc);
                    }
                });
            }
            else {
                var ops = req.query.ops
                switch(ops){  

                    case "changeRepStatus":{
                        if(req.body.update){
                            var idReparacion = req.params.id;//id de la reparacion

                            var update = {
                                "$set": {
                                    "estado": req.body.update.estado
                                }
                            }

                            var consulta = await reparacionModel.updateOne({_id: idReparacion},update);

                            res.status(200).json({
                                estado:true,
                                doc: consulta
                            })

                        }
                    }
                    break;

                    case "changeDispRepStatus":{
                        if(req.body.update){
                            var idReparacion = req.params.id;//id de la reparacion
                            var dispositivos = req.body.update;
                            var informe = []
                            for(var i = 0; i < dispositivos.length; i++){
                                var idItemDisp = dispositivos[i].dispositivo;
                                const update = {
                                    "$set": {
                                        "list_items.$[element].estado": dispositivos[i].estado
                                    }
                                }
        
                                const arrayFilter = {
                                    arrayFilters: [ { "element._id": { _id: idItemDisp } } ]
                                }
    
                                var consulta = await reparacionModel.updateOne(
                                    {"_id": idReparacion},
                                    update,
                                    arrayFilter);
                                
                                informe.push({
                                    dispositivo:idItemDisp,
                                    result: consulta    
                                });
                            }
                            
                            res.status(200).json({
                                estado:true,
                                docs: informe
                            })
                            

                        }
                    }
                    break;
                    
                    case "changeItemDispRepStatus":{
                        if(req.body.update){
                            var idReparacion = req.params.id;//id de la reparacion
                            var items = req.body.update;
                            var informe = []
                            for(var i = 0; i < items.length; i++){
                                var idItemDisp = items[i].item;
                                var idDisp = items[i].dispositivo;
                                const update = {
                                    "$set": {
                                        "list_dispositivos.$[disp].list_item_reparacion.$[item].estado": items[i].estado
                                    }
                                }
        
                                const arrayFilter = {
                                    arrayFilters: [ { "disp._id": { _id: idDisp } },{ "item._id": { _id: idItemDisp } } ]
                                }
    
                                var consulta = await reparacionModel.updateOne(
                                    {"_id": idReparacion},
                                    update,
                                    arrayFilter);
                                
                                informe.push({
                                    itemDisp:idItemDisp,
                                    result: consulta    
                                });
                            }
                            
                            res.status(200).json({
                                estado:true,
                                docs: informe
                            })
                            

                        }
                    }
                    break;

                    case "updateInsumos": {

                        if(req.body.update){
                            var idReparacion = req.params.id;//id de la reparacion
                            var insumos = req.body.update;
                            var informe = [];
                            //Verifico que hay stock para los insumos que va a consumir la reparacion
                            var valInsumos = await validarInsumos(insumos);

                            if(valInsumos.estado == "TRUE"){
                                for(var i = 0; i < insumos.length; i++){
                                    var insumo = insumos[i].insumos;//Array de insumos que se agregaran al disp
                                    var idDisp = insumos[i].dispositivo;
                                    const update = {
                                        
                                        "list_dispositivos.$[disp].list_insumos_cons": insumo
                                        
                                    }
            
                                    const arrayFilter = {
                                        arrayFilters: [ { "disp._id": { _id: idDisp } } ]
                                    }
        
                                    var consulta = await reparacionModel.updateOne(
                                        {"_id": idReparacion},
                                        update,
                                        arrayFilter);
                                    
                                    informe.push({
                                        itemDisp:idItemDisp,
                                        result: consulta    
                                    });
                                }

                                res.status(200).json({
                                    estado:true,
                                    docs: informe
                                })
                            }
                            else {
                                res.status(200).json({
                                    estado:false,
                                    error: "Falta de stock para algun insumo",
                                    informe: valInsumos
                                })
                            }
                            

                        }
                       
                        
                    }
                    break;
                    case "finishRepair":{
                        var idReparacion = req.params.id;

                        var factura = await reparacionModel.aggregate([

                            {$match: {"_id":  mongoose.Types.ObjectId(idReparacion) }},
                            { $unwind: "$list_dispositivos" },
                            { $unwind: "$list_dispositivos.list_item_reparacion" },
                            
                            {
                                    
                                $group: {
                                    _id:{ reparacion: "$_id",
                                            dispositivo: "$list_dispositivos._id",
                                            estado: "$list_dispositivos.estado",
                                            item: "$list_dispositivos.list_item_reparacion"
                                        },
                                        
                                    }
                            },
                            {
                                $lookup:{
                                            from: "REP_item_reparacion",
                                            localField: "_id.item.item",
                                            foreignField: "_id",
                                            as: "itemBD"
                                        }
                            },
                            { $unwind: "$itemBD" },
                            {
                                    
                                $group: {
                                    _id:{ 
                                            reparacion: "$_id.reparacion",
                                            dispositivo: "$_id.dispositivo",
                                            estado: "$_id.estado",
                                            item: "$_id.item",
                                            precio: "$itemBD.precio",
                                            dificultad:"$itemBD.dificultad"
                                        },
                                    subtotal: { $sum:  "$itemBD.precio" }
                                        
                                    }
                            },
                            {$group: {
                                _id: { reparacion: "$_id.reparacion", fecha: "$_id.fecha"},
                                        dispositivos:{
                                            $push:
                                                    {
                                                            
                                                            dispositivo: "$_id.dispositivo",
                                                            estado: "$_id.estado",
                                                            item: "$_id.item",
                                                            precio: "$_id.precio",
                                                            dificultad:"$_id.dificultad"
                                                    }
                                                
                                                }  , 
                                        total: { $sum: "$subtotal" }
                                    },
                                    
                            },
                                
                        ])

                        //actualizo estado de reparacion a terminado
                        var update = {
                            "$set": {
                                "estado": "TERMINADO"
                            }
                        }

                        var consulta = await reparacionModel.updateOne({_id: idReparacion},update);

                        //obtengo la reparacion

                        var reparacion = await reparacionModel.findById( {_id: idReparacion});

                        //actualizo stock de insumos consumidos
                            //agrupo por insumos
                        var insumos = await reparacionModel.aggregate([
                            {$match: {"_id": mongoose.Types.ObjectId(idReparacion)}},
                            { $unwind: "$list_dispositivos" },
                            { $unwind: "$list_dispositivos.list_insumos_cons" },
                            {
                                   
                                $group: {
                                    _id:{ 
                                          item: "$list_dispositivos.list_insumos_cons.insumo",
                                          cantidad: "$list_dispositivos.list_insumos_cons.cantidad"
                                        },
                                     
                                    }
                            }
                        ])
                        
                        //console.log("insumos:",insumos)

                        var informeInsumos = []
                        //descuento los insumos consumidos
                        for(i = 0; i < insumos.length; i++){
                            var idInsumo = insumos[i]._id.item;
                            var cantidad =insumos[i]._id.cantidad;

                            var update = {
                                "$inc":{ cantidad: - (cantidad)}
                            }

                            var consulta = await insumoModel.updateOne(
                                {_id: idInsumo}, 
                                update
                            )

                            informeInsumos.push(consulta);
                        }

                        res.status(200).json(
                            {
                                estado: true,
                                factura: factura,
                                reparacion: reparacion,
                                insumos: informeInsumos
                            }
                        )
                    }
                    break;
                    /*
                    case "confirminsumos": {
                        var insumos = req.body.insumos;
                        var valido = true;
                        var i = 0;

                        while (valido &&  i < insumos.length){
                            var insumoDB = await insumoModel.findOne({_id: insumos[i].insumo});
                            if(insumoDB.cantidad - insumos[i].cantidad < 0){
                                valido= false;
                            }
                            i++;
                        } 
                
                        if(valido){
                            insumos.forEach(async element=>{
                                var update = {
                                    "$inc":{ cantidad: - (element.cantidad)}
                                }
    
                                await insumoModel.updateOne({
                                    _id : element.insumo
                                    },
                                    update
                                ).then((doc,error)=>{
                                    if(error){
                                        res.status(200).json({
                                             estado:true,
                                             doc:doc
                                        })
                                    }
                                    else {
                                        res.status(200).json({
                                            estado:true,
                                            doc:doc
                                        })
                                    }
                                })
                            })
                        }
                        else {
                            res.status(404).json({
                                estado:false,
                                error:"Cantidad no disponible para algun insumo"
                            })
                        }
                               
                    }
                    break;
                    */
                }
            }
        } catch (error) {
            next(error)
        }
        async function updateDisp(reparacion){

            if(req.params.id){
                var id_reparacion = req.params.id;
                await dispositivoModel.deleteMany({id_reparacion: id_reparacion},
                    async function (err,docs){
                    if(err){
                        res.status(400).json({
                            estado: false,
                            error:err,
                            doc:docs
                        })
                    }
                    else {
                        var newDisp = req.body.list_items;
                        newDisp.map( (elem)=>{
                            elem.id_reparacion = id_reparacion; /*agrego el id de reparacion*/
                        })

                        await dispositivoModel.insertMany(newDisp,
                            async function (err, doc){
                            if(err){
                                res.status(400).json({
                                    estado: false,
                                    error:err,
                                })
                            }     
                            else{
                                doc.filter(obj => obj._id);
                                
                                var update = {
                                    list_items: doc
                                }
                                await reparacionModel.updateOne({
                                    _id: req.params.id,
                                },
                                update,
                                (err, collection) => {
                                    if (err) {
                                        res.status(400).json({
                                            estado: false,
                                            error:err
                                        })
                                    } else {
                                        console.log("doc", collection);
                                        res.status(200).json({
                                            estado:true,
                                            docs: collection
                                        })
                                    }
                                });
                            }  
                        })
                    }
                })
            }
            
        }

        async function validarInsumos(update){
            var informe = {
                estado:"TRUE",
                docs: []
            };

            var listInsumos = [];
            //filtro por insumos
            for(let i=0; i<update.length; i++){
                var items =  update[i].insumos;
                for(let j = 0; j < items.length; j++){
                   
                    var indice = listInsumos.findIndex(obj => obj.insumo == items[j].insumo);
                    
                    if(indice == -1){
                        listInsumos.push(items[j]);
                    }
                    else{
                        listInsumos[indice].cantidad = listInsumos[indice].cantidad + items[j].cantidad;
                    }
                    
                }
                
            }
            //console.log("listInsumosLimpio",listInsumos)

            //valido insumos
            var valido = true;
            var i = 0;
            
            while (valido &&  i < listInsumos.length){
                var idInsumo = listInsumos[i].insumo;
                var insumoBD = await insumoModel.findOne({_id: idInsumo});

                if(insumoBD.cantidad - listInsumos[i].cantidad < 0){
                    valido = false;
                    informe.estado = "FALSE"
                    informe.docs.push({
                        _id:insumoBD._id,
                        insumo: insumoBD.nombre,
                        estado: false,
                        cantidadBD: insumoBD.cantidad,
                        cantidadReq: listInsumos[i].cantidad
                    })
                }
                else {
                    informe.docs.push({
                        _id:insumoBD._id,
                        insumo: insumoBD.nombre,
                        estado: true,
                        cantidadBD: insumoBD.cantidad,
                        cantidadReq: listInsumos[i].cantidad
                    })
                }
                i++;
            } 
            //console.log("informe", informe)
            return informe;
        }
    },
    delete: async function(req,res, next){
        try {
            if(req.params.id){
                await reparacionModel.deleteOne({
                    _id: req.params.id,
                },
                (err, doc) => {
                    if (err) {
                        res.status(400).json({
                            estado: false,
                            error:err
                        })
                    } else {
                        //deleteDisp();
                        res.status(200).json({
                            estado: true,
                            doc:doc
                        })
                    }
                });
            }
        } catch (error) {
            next(error)
        }
        async function deleteDisp(){
            try {
                if(req.params.id){
                    await dispositivoModel.deleteMany({
                        id_reparacion: req.params.id,
                    },
                    (err, doc) => {
                        if (err) {
                            res.status(400).json({
                                estado: false,
                                error:err
                            })
                        } else {
                            res.status(200).json({
                                estado:true,
                                docs: doc
                            })
                        }
                    });
                }
            } catch (error) {
                next(error)
            }
            
            
        }
    },
    save: async function(req,res, next){
        try {

            const create = new reparacionModel({
                fecha: req.body.fecha,
                descrip: req.body.descrip,
                empleado: req.body.empleado,
                cliente:req.body.cliente,
                list_dispositivos: req.body.list_dispositivos
            });

            create.save(
                (err, doc) => {
                    if (err) {
                        res.status(400).json({
                            estado: false,
                            error: err,
                            lugar: "reparacion"
                        });
                    } else {
                        //var id_reparacion = doc._id;
                        //console.log("dispBody", req.body.list_items);
                        /*
                        if(req.body.list_items){
                            var items = req.body.list_items;
                             console.log("dispArray", req.body.list_items)
                            insertitems(items, id_reparacion);
                        }
                        */
                        res.status(200).json({
                            estado: true,
                            doc: doc
                        });

                    }
                });
        
        } catch (error) {
            next(error)
        }

        async function insertitems(items, id_reparacion){
            try {
                console.log(items, id_reparacion)
                items.map( (elem)=>{
                    elem.id_reparacion = id_reparacion;
                   // elem.estado = "inicial"
                     /*agrego el id de reparacion*/
                })
               
                await dispositivoModel.insertMany(items,
                 (err, doc) => {
                    if (err) {
                        res.status(400).json({
                            estado: false,
                            error:err
                        })
                    } else {
                        var id_items = new Array;
                        for(let i = 0; i< doc.length; i++){
                            id_items.push(doc[i]._id);
                        }
                        console.log("id_items", id_items);
                        additemsRep(id_items,id_reparacion);
                    }
                });

            } catch (error) {
                next(error);
            }
        }

        async function additemsRep(id_items,id_reparacion){
            const update = {
                list_items: id_items
            }
            await reparacionModel.updateOne({
                _id: id_reparacion,
            },
            update,
            (err, collection) => {
                if (err) {
                    res.status(400).json({
                        estado: false,
                        error:err
                    })
                } else {
                    console.log("doc", collection);
                    res.status(200).json({
                        estado:true,
                        docs: collection
                    })
                }
            });
        }

    }
}