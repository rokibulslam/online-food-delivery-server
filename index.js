const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2efaz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log(uri);

async function run() {
    
    try {
        await client.connect();
        console.log("server connected");
        const database = client.db("hungry");
        const foodCollection = database.collection("allFoods");
        
        // Find all Foods 
        app.get("/foods", async (req, res) => {
          const cursor = foodCollection.find({});
          const allFoods = await cursor.toArray();
          res.send(allFoods);
        });
        // Add a Food 
        app.post("/foods", async (req, res) => {
          const food = req.body;
          console.log("hit the post api", food);
          const result = await carCollection.insertOne(allFoods);
          console.log(result);
          res.json(result);
        });


    } finally {
      // await client.close()
    }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`listening at port ${port}`);
});