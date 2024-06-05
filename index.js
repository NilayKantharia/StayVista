const express = require('express');
require('dotenv').config();
const app = express();
const {connectToMongo} = require('./connection');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const Listing = require('./models/listing');

connectToMongo(process.env.mongoDBURL).then(() => console.log('MongoDB connected'));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.send("working!");
})

app.get('/listing', async(req, res) => {
    let allListing = await Listing.find({});
    res.render("./listing/index", {allListing});
})

app.get("/listing/new", (req, res) => {
    res.render("./listing/new")
})

app.get("/listing/:id", async(req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("./listing/show", {listing});
})

app.post("/listing", async(req, res) => {
    const {title, description, image, price, location, country} = req.body;
    const newListing = new Listing({title, description, image, price, location, country});
    await newListing.save();
    res.redirect("/listing")
})

app.get('/listing/:id/edit', async(req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render('./listing/edit', {listing});
})

app.put('/listing/:id', async(req, res) => {
    const {id} = req.params;
    const {title, description, image, price, location, country} = req.body;
    await Listing.findByIdAndUpdate(id, {title, description, image, price, location, country});
    res.redirect(`/listing/${id}`)
})

app.delete('/listing/:id', async(req, res) => {
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listing')
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