const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const res = require("express/lib/response");
const ObjectId = require("mongodb").ObjectId;

// Middleware
app.use(cors());
app.use(express.json());

// Connecting MongoDB database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2efaz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// API
async function run() {
  try {
    // Creating Collection at MongoDB
    await client.connect();
    console.log("server connected");
    const database = client.db("hungry");
    const foodCollection = database.collection("allFoods");
    const orderCollection = database.collection("orders");
    const userCollection = database.collection("users")

    // Find all Foods
    app.get("/foods", async (req, res) => {
      const cursor = foodCollection.find({});
      const allFoods = await cursor.toArray();
      res.send(allFoods);
    });

    // Get Users Order
    app.get("/orders", async (req, res) => {
      const cursor = orderCollection.find({});
      const orders = await cursor.toArray();
      res.json(orders);
    });
    // Search food with product id
    app.get("/foods/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = {
        _id: ObjectId(id),
      };
      const product = await foodCollection.findOne(query);
      console.log(product);
      res.json(product);
    });
    // Search Orderd food by email
    app.get("/orders/:email", async (req, res) => {
      const email = req.params.email;
      const query = {
        email: req.params.email,
      };
      const result = await orderCollection.find(query).toArray();
      console.log(result);
      res.json(result);
    });
    // Update Ordered Product's status 
    app.put("/status/:id", async (req, res) => {
      const id = req.params.id;
      const updateInfo = req.body;
      const result = await orderCollection.updateOne(
        { _id: ObjectId(id) },
        { $set: { status: updateInfo.status } }
      );
      res.send(result);
    });
    // Delete a Food Item 
    app.delete("/foods/delete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await foodCollection.deleteOne(query);
      res.json(result);
    });
    // Delete Orderd Item by ID
    app.delete("/delete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.json(result);
    });

    // Add a Food
    app.post("/foods", async (req, res) => {
      const food = req.body;
      console.log("hit the post api", food);
      const result = await foodCollection.insertOne(food);
      console.log(result);
      res.json(result);
    });
    // *******User Section********
    // Get saved User from database 
    app.get('/users', async (req, res) => {
      const cursor = userCollection.find({});
      const users = await cursor.toArray();
      res.json(users);
    })
    // save new user to database 
    app.post('/users', async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user)
      console.log(user);
      res.json(user)
    })
    // check google user and update/add user to database
    app.put('/users', async (req, res) => {
      const user = req.body;
      const checkUser = { email: user.email };
      const option = { upsert: true };
      const updateUser = { $set: user };
      const result = await userCollection.updateOne(checkUser, updateUser, option);
      console.log(result)
      res.json(result);
    });

    // Add Order
    app.post("/orders", async (req, res) => {
      const order = req.body;
      console.log("hit the post api", order);
      const result = await orderCollection.insertOne(order);
      console.log(result);
      res.json(result);
    });
  } finally {
    // await client.close()
  }
}

run().catch(console.dir);

// Checking server
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`listening at port ${port}`);
});
