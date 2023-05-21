const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tcsk2jo.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const superHerosCollection = client
      .db("super-hero-DB")
      .collection("super-hero-toys");

    //get all data with  get operations
    app.get("/herotoys", async (req, res) => {
      const cursor = superHerosCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //send data in client side with post operations

    app.post("/herotoys", async (req, res) => {
      const toys = req.body;
      const result = await superHerosCollection.insertOne(toys);
      res.send(result);
    });

    // get hero toys single data with get operations
    app.get("/herotoys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await superHerosCollection.findOne(query);
      res.send(result);
    });

    // get the use own data

    app.get("/mytoys", async (req, res) => {
      let query = {};
      if (req.query?.email) {
        query = { seller_email: req.query.email };
      }
      const result = await superHerosCollection.find(query).toArray();
      res.send(result);
    });

    // my toys delete operations
    app.delete("/mytoys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await superHerosCollection.deleteOne(query);
      res.send(result);
    });

    // update toy operations
    app.get("/update/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await superHerosCollection.findOne(query);
      res.send(result);
    });

    // update some information specifice toy

    app.put("/update/:id", async (req, res) => {
      const id = req.params.id;
      const updateToy = req.body;
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const toy = {
        $set: {
          price: updateToy.price,
          quantity: updateToy.quantity,
          description: updateToy.description,
        },
      };
      const result = await superHerosCollection.updateOne(filter, toy, option);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Super hero universe running");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
