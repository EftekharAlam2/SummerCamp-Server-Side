const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.v1phe5i.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();

    const classCollection = client.db("sportsCamp").collection("classes");
    // const userCollection = client.db("sportsCamp").collection("users");

    app.get("/classes", async (req, res) => {
      const result = await classCollection
        .find()
        .sort({ students: -1 })
        .toArray();
      res.send(result);
    });

    // app.get("/users", async (req, res) => {
    //   const result = await userCollection.find().toArray();
    //   res.send(result);
    // });

    app.post("/classes", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const existingUser = await classCollection.findOne(query);

      if (existingUser) {
        return res.send({ message: "user already exists" });
      }

      const result = await classCollection.insertOne(user);
      res.send(result);
    });

    app.get("/classes/role/:id", async (req, res) => {
      const result = await classCollection.find().toArray();
      res.send(result);
    });

    app.patch("/classes/admin/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          role: "admin",
        },
      };

      const result = await classCollection.updateOne(filter, updateDoc);
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
  res.send("The server is running");
});

app.listen(port, () => {
  console.log(`The Server is running on port ${port}`);
});

// app.post("/users", async (req, res) => {
//   const user = req.body;
//   const query = { email: user.email };
//   const existingUser = await usersCollection.findOne(query);

//   if (existingUser) {
//     return res.send({ message: "user already exists" });
//   }

//   const result = await usersCollection.insertOne(user);
//   res.send(result);
// });
// //get the user

// app.get("/users", async (req, res) => {
//   const result = await usersCollection.find().toArray();
//   res.send(result);
// });

// app.get("/users/role/:id", async (req, res) => {
//   const result = await usersCollection.find().toArray();
//   res.send(result);
// });

// app.get("/users/role/:email", async (req, res) => {
//   const email = req.params.email;

//   if (req.decoded.email !== email) {
//     res.send({ admin: false, instructor: false });
//     return;
//   }

//   const query = { email: email };
//   const user = await usersCollection.findOne(query);
//   const result = {
//     admin: user?.role === "admin",
//     instructor: user?.role === "instructor",
//   };
//   res.send(result);
// });

// app.patch("/users/role/:id", async (req, res) => {
//   const id = req.params.id;
//   const { role } = req.body;

//   const filter = { _id: new ObjectId(id) };
//   const updateDoc = {
//     $set: {
//       role: role === "instructor" ? "instructor" : "admin",
//     },
//   };

//   const result = await usersCollection.updateOne(filter, updateDoc);
//   res.send(result);
// });
