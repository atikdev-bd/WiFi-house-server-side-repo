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
console.log(uri);
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

    /// add service using post method ///
    app.post("/add", async (req, res) => {
      const info = req.body;
      const result = await serviceCollection.insertOne(info);

      if (acknowledged) {
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
      console.log(result);
    });

    /// Delete items ////
    app.delete('/review/:id', async(req, res)=>{
      const id = req.params.id
      console.log(id)
      const query = {_id : ObjectId(id)}
      const result = await reviewCollection.deleteOne(query)
      res.send(result)
    })

    /// get data using query with email ///
    app.get("/reviews", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }

      const cursor = reviewCollection.find(query);
      const result = await cursor.toArray();
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

    app.get("/allService", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const allService = await cursor.toArray();
      res.send(allService);
    });
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
