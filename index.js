const express = require("express");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

// middle ware \\\
app.use(cors());
app.use(express.json());

//Mongodb implement here \\\

const uri = `mongodb+srv://${process.env.BROD_BRAND}:${process.env.SECRET_KEY}@cluster0.h7epoo8.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const serviceCollection = client.db("brodBrand").collection("services");
    const reviewCollection = client.db("brodBrand").collection("review");

    ///explore jwt token ///
    app.post("/jwt", (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
      res.send({ token });
    });

    ///gwt function ///
    const verifyJwt = (req, res, next)=>{
      const authHeader = req.headers.authorization
      if(!authHeader){
        return res.status(401).send({massage : 'Unauthorized Access'})

      }
      const token = authHeader.split(' ')[1]
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded)=>{
            if(error){
              return res.status(403).send({massage : 'Unauthorized Access'})
           }
           req.decoded = decoded
           next()

      })

    }

    /// add service using post method ///
    app.post("/add", async (req, res) => {
      const info = req.body;
      const result = await serviceCollection.insertOne(info);
      if (result?.acknowledged) {
        res.send({
          status: true,
          massage: "Data added successfully",
        });
      } else {
        status: false;
        massage: "Something wrong";
      }
    });

    /// add review using post and store database///
    app.post("/review", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result)
    });

    /// Delete items ////
    app.delete('/review/:id', async(req, res)=>{
      const id = req.params.id
     
      const query = {_id : ObjectId(id)}
      const result = await reviewCollection.deleteOne(query)
      res.send(result)
    })

    //// update doc with patch ///
    app.patch('/review/:id', async(req, res)=>{
            const id = req.params.id 
            const status = req.body.status
            const query = {_id : ObjectId(id)}
            const updateDoc = {
              $set : {
              status : status
              }
            }
            const result = await reviewCollection.updateOne(query, updateDoc)
            res.send(result)
    })

    /// get data using query with email ///
    app.get("/reviews", verifyJwt, async (req, res) => {
      const decoded = req.decoded
     
      if(decoded.email !== req.query.email){
        es.status(401).send({massage : 'Unauthorized Access'})
      }
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }

      const cursor = reviewCollection.find(query);
      const result = await cursor.toArray();
      const sort = result.reverse()
      res.send(result);
    });

    /// read a 3 data use limit///
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.limit(3).toArray();
      res.send(services);
    });
    /// read a all service with use query ///

   
    //get data with id///
    app.get("/service/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.send(service);
    });
  } finally {
  }
};

run().catch((error) => console.log(error));

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log("server is running on port :", port);
});
