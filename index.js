const express = require('express');
require('dotenv').config()
const app = express();
const {connectToMongo} = require('./connection');
const Listing = require('./models/listing')

connectToMongo(process.env.mongoDBURL).then(() => console.log('MongoDB connected'));

app.get('/', (req, res) => {
    res.send("working!")
})

app.get('/testingroute', async (req, res) => {
    let sampleListing = new Listing({
        title: "New Villa",
        description: "Near the beach",
        price: 1200,
        location: "Goa",
        country: "India"
    })

    await sampleListing.save();
    res.send("Success")
})

app.listen(process.env.Port, () => console.log(`Server started at Port: ${process.env.Port}`))