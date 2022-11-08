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

    ///explore jwt token ///
    app.post("/jwt", (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
      res.send({ token });
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
      console.log(id);
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      console.log(service);
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
