const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000
require("dotenv").config();

// middle ware \\\
app.use(cors())
app.use(express.json())

//Mongodb implement here \\\


const uri = `mongodb+srv://${process.env.BROD_BRAND}:${process.env.SECRET_KEY}@cluster0.h7epoo8.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async() =>{

    try{


        
    }
   finally{

   }

}

run().catch(error =>console.log(error))


app.get('/', (req, res)=>{
    res.send('Server is running')
})


app.listen(port, ()=>{
    console.log('server is running on port :', port)
})