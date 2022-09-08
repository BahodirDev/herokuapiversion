const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { MONGO_URI } = require('./keys/key');
const path = require('path')

const PORT = process.env.PORT || 5000;
// config
app.use(express.json());
// app.use(express)



const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}


app.use(cors(corsOptions)) // Use this after the variable declaration

mongoose.connect(MONGO_URI,()=>{
    console.log(`DB has been started on port ${PORT}`);
})

// routes
app.use(require('./routes/category'));
app.use(require('./routes/productsRouter'));
app.use(require('./routes/reportRoute'));
app.use(require('./routes/employer'));
app.use(require('./routes/auth'));
app.use(require('./routes/orderRoute'));


app.listen(PORT,()=>{
    console.log(`Port has been started on port ${PORT}`);
});

if(process.env.NODE_ENV === "production"){
    app.use(express.static('client/dist'))
    app.use("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"))
    })
}
