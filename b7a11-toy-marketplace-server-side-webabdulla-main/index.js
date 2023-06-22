const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nor1pdm.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // await client.connect();

    const toysCollection = client.db('toysWorld').collection('toys');

    // Get all toys
    app.get("/toys", async (req, res) => {
      const cursor = toysCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Get a specific toy by ID
    app.get('/toys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const result = await toysCollection.findOne(query);
      res.send(result);
    });


    
    //adding
    app.post('/adding',async(req,res) =>{
      const adding = req.body;
      const result = await toysCollection.insertOne(adding)
      console.log(adding);
      res.send(result);
    })


    // Add a new toy
    app.post('/toys', async (req, res) => {
      const newToy = req.body;
      const result = await toysCollection.insertOne(newToy);
      res.send(result);
    });

    // Update a toy by ID
    app.put('/toys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updatedToy = req.body;

      const result = await toysCollection.updateOne(query, { $set: updatedToy });
      res.send(result);
    });

    // Delete a toy by ID
    app.delete('/toys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const result = await toysCollection.deleteOne(query);
      res.send(result);
    });

    // Get toys by user email
    app.get("/myToy/:email", async (req, res) => {
      const email = req.params.email;
      const result = await toysCollection.find({ postedBy: email }).toArray();
      res.send(result);
    });

    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Close the client when finished
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Toys world is running");
});

app.listen(port, () => {
  console.log(`Toys world server is running on port ${port}`);
});
