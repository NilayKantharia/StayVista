const express = require('express');
require('dotenv').config();
const app = express();
const {connectToMongo} = require('./connection');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const Listing = require('./models/listing');
const wrapAsync = require('./utils/wrapAsync.js')
const ExpressError = require('./utils/ExpressError.js')
const {listingSchema} = require('./schema.js')

connectToMongo(process.env.mongoDBURL).then(() => console.log('MongoDB connected'));

app.set("view engine", "ejs");
app.engine('ejs',ejsMate)
app.set("views", path.join(__dirname, "views"));


app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, "/public")));

app.get('/', (req, res) => {
    res.send("working!");
})

const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errMsg)
    }else{
        next();
    }

}

app.get('/listing', wrapAsync(async(req, res) => {
    let allListing = await Listing.find({});
    res.render("./listing/index", {allListing});
    })
)

app.get("/listing/new", (req, res) => {
    res.render("./listing/new")
})

app.get("/listing/:id", wrapAsync(async(req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("./listing/show", {listing});
})
)

app.post("/listing",validateListing, wrapAsync(async(req, res, next) => {
    const {title, description, image, price, location, country} = req.body;
    const newListing = new Listing({title, description, image, price, location, country});
    await newListing.save();
    res.redirect("/listing")
    })
)

app.get('/listing/:id/edit', wrapAsync(async(req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render('./listing/edit', {listing});
})
)

app.put('/listing/:id', validateListing, wrapAsync(async(req, res) => {
    const {id} = req.params;
    const {title, description, image, price, location, country} = req.body;
    await Listing.findByIdAndUpdate(id, {title, description, image, price, location, country});
    res.redirect(`/listing/${id}`)
})
)

app.delete('/listing/:id', wrapAsync(async(req, res) => {
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listing')
})
)

app.get('/testingroute', wrapAsync(async (req, res) => {
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
)

app.all('*', (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"))
})

app.use((err, req, res, next) => {
    let{statusCode = 500, message = "Something Went Wrong!"} = err;
    res.status(statusCode).render("error.ejs", {message})
    // res.status(statusCode).send(message)
})

app.listen(process.env.Port, () => console.log(`Server started at Port: ${process.env.Port}`))