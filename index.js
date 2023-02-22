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
        const usersCollections = client.db('communalForum').collection('users')
        const commentsCollections = client.db('communalForum').collection('comments')

        app.get('/posts', async (req,res) => {
            const query = {}
            const result = await postsCollections.find(query).toArray()
            res.send(result)
        })

        app.get('/posts/count', async (req,res) => {
            const query = {}
            const sort = {likes: -1}
            const results = await postsCollections.find(query).sort(sort).limit(3).toArray()
           
            // const alredyBooked = results.map(result => result.likes)
            // console.log(results)
            res.send(results)
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

        app.get('/users', async (req,res) => {
            const query = {}
            const result = await usersCollections.find(query).toArray()
            res.send(result)
        })

        app.get('/users/:id', async (req,res) => {
            const id = req.params.id
            const query = {uid: id}
            const result = await usersCollections.findOne(query)
            res.send(result)
        })

        app.post('/users', async (req,res) => {
            const query = req.body
            const result = await usersCollections.insertOne(query)
            res.send(result)
        })

        app.put('/users/:id', async (req,res) => {
            const newFiled = req.body
            const id = req.params.id
            const filter = { uid: id }
            const updatedDoc = {
                $set: {
                    name: newFiled.name,
                    email: newFiled.email,
                    university: newFiled.university,
                    address: newFiled.address
                }
            }
            const optins = { upsert: true }
            const result = await usersCollections.updateOne(filter, updatedDoc,optins)
            res.send(result)
        })

        app.get('/comments', async (req,res) => {
            const query = {}
            const result = await commentsCollections.find(query).toArray()
            res.send(result)
        })
        
        app.get('/comments/:id', async (req,res) => {
            const id = req.params.id
            const filter = { commentId: id }
            const result = await commentsCollections.find(filter).toArray()
            res.send(result)
        })

        app.post('/comments', async (req,res) => {
            const query = req.body
            const result = await commentsCollections.insertOne(query)
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