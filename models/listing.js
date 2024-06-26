const mongoose = require('mongoose');
const Reviews = require('./reviews')
const User = require("./user");
const { types } = require('joi');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title : {
        type: String,
        required: true,
    },
    description: String,
    image: {
       url: String,
       filename: String
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
          },
          coordinates: {
            type: [Number],
            required: true
        }
    },
    category:{
        types: String,
        enum: ["Trending", "Rooms", "Iconic Cities", "Mountains", "Castles", "Amazing Pools", "Camping", "Farms", "Arctic", "Domes", "Boats"]
    } 
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing){
        await Reviews.deleteMany({_id: {$in: listing.reviews}});
    }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;