const mongoose = require("mongoose");
const initdata = require("./data2");
const Listing = require("../models/listing");
require('dotenv').config();
const {connectToMongo} = require('../connection');

connectToMongo(process.env.mongoDBURL).then(() => console.log('MongoDB connected'));

const initDB = async () => {
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({...obj, owner: "667078509e659d741f726a34"}));
    await Listing.insertMany(initdata.data);
    console.log("Data Initialized successfully");
}

initDB()