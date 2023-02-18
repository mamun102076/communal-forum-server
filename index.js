const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

require('dotenv').config()
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ampetqi.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const postsCollections = client.db('communalForum').collection('posts')

        app.get('/posts', async (req,res) => {
            const query = {}
            const result = await postsCollections.find(query).toArray()
            res.send(result)
        })

        app.get('/posts/:id', async (req,res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const result = await postsCollections.findOne(filter)
            res.send(result)
        })

        app.post('/posts', async (req,res) => {
            const query = req.body
            const result = await postsCollections.insertOne(query)
            res.send(result)
        })

        app.put('/posts/:id', async (req,res) => {
            const id = req.params.id
            const count = req.body
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updatedDoc = {
                $set: {
                    likes: count.count
                }
            }
            const result = await postsCollections.updateOne(filter, updatedDoc, options)
            res.send(result)
        })
    }
    finally{

    }
}
run().catch(error => console.log(error))

app.get('/', async (req, res) => {
    res.send(`communal forum is running on port ${port}`)
})
app.listen(port, () => console.log('communal forum is running'))