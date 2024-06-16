const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const {listingSchema} = require('../schema.js');
const ExpressError = require('../utils/ExpressError.js');
const Listing = require('../models/listing');

const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }

}


router.get('/', wrapAsync(async(req, res) => {
    let allListing = await Listing.find({});
    res.render("./listing/index", {allListing});
    })
)

router.get("/new", (req, res) => {
    res.render("./listing/new")
})

router.get("/:id", wrapAsync(async(req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    res.render("./listing/show", {listing});
})
)

router.post("/",validateListing, wrapAsync(async(req, res, next) => {
    const {title, description, image, price, location, country} = req.body;
    const newListing = new Listing({title, description, image, price, location, country});
    await newListing.save();
    res.redirect("/listing")
    })
)

router.get('/:id/edit', wrapAsync(async(req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render('./listing/edit', {listing});
})
)

router.put('/:id', validateListing, wrapAsync(async(req, res) => {
    const {id} = req.params;
    const {title, description, image, price, location, country} = req.body;
    await Listing.findByIdAndUpdate(id, {title, description, image, price, location, country});
    res.redirect(`/listing/${id}`)
})
)

router.delete('/:id', wrapAsync(async(req, res) => {
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listing')
})
)

module.exports = router;