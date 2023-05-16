const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middlewire
app.use(cors());
app.use(express.json())
// ------------------------------------


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qtemx5j.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    const productCollection = client.db("emaJohnDB").collection("products");

    app.get('/products' , async(req, res) => {
      console.log(req.query);
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const skip = page*limit;

      const result = await productCollection.find().skip(skip).limit(limit).toArray();
      res.send(result);
    })

    app.get('/totalProducts' , async(req, res) => {
      const result = await productCollection.estimatedDocumentCount();
      res.send({totalProducts : result})
    })
    // await client.connect();
    app.post('/productsByIds', async(req, res) => {
      const ids = req.body;
      const objectIds = ids.map(id => new ObjectId(id));
      const query = { _id: { $in: objectIds } }
      console.log(ids);
      const result = await productCollection.find(query).toArray();
      res.send(result);
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

    // await client.close();
  }
}
run().catch(console.dir);

// ------------------------------------

app.get('/', (req, res) => {
  res.send('ema john server')
})

app.listen(port, () => {
  console.log(`ema John server is running on port: ${port}`);
})