const express = require('express');
require('dotenv').config()
const app = express();
const {connectToMongo} = require('./connection');

connectToMongo(process.env.mongoDBURL).then(() => console.log('MongoDB connected'));

app.get('/', (req, res) => {
    res.send("working!")
})

app.listen(process.env.Port, () => console.log(`Server started at Port: ${process.env.Port}`))