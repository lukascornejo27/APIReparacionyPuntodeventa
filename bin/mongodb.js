const mongoose = require('mongoose');

const uri = "mongodb+srv://lukascornejo27:lara1015@cluster0.qwt5j.mongodb.net/apirepventdbdemo?retryWrites=true&w=majority";
//const uri = 'mongodb://localhost:27017/repSalesDB';
try {
    // Connect to the MongoDB cluster
     mongoose.connect(
      uri,
      { useNewUrlParser: true, useUnifiedTopology: true },
      () => console.log(" Mongoose is connected")
    );

  } catch (e) {
    console.log("could not connect");
  }

/*
mongoose.connect(uri, function(error){
    if(error){
        console.log("error", error);
    }
    else{
        console.log("Conectado a MongoDB");
    }
});
 */

module.exports = mongoose;
