const mongoose = require("mongoose");
const initdata = require("./data");
const Listing = require("../models/listing");
require('dotenv').config();
const {connectToMongo} = require('../connection');

connectToMongo(process.env.mongoDBURL).then(() => console.log('MongoDB connected'));

const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initdata.data);
    console.log("Data Initialized successfully")
}

initDB()