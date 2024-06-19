const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const {listingSchema} = require('../schema.js');
const ExpressError = require('../utils/ExpressError.js');
const Listing = require('../models/listing');
const { isLoggedIn } = require('../middlewares.js');


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

router.get("/new", isLoggedIn, (req, res) => {
    res.render("./listing/new")
})

router.get("/:id", wrapAsync(async(req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error", "Listing you requested for does not exists");
        res.redirect("/listing");
    }
    res.render("./listing/show", {listing});
})
)

router.post("/", isLoggedIn, validateListing, wrapAsync(async(req, res, next) => {
    const {title, description, image, price, location, country} = req.body;
    const newListing = new Listing({title, description, image, price, location, country});
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listing")
    })
)

router.get('/:id/edit', isLoggedIn, wrapAsync(async(req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exists");
        res.redirect("/listing");
    }
    res.render('./listing/edit', {listing});
})
)

router.put('/:id', isLoggedIn, validateListing, wrapAsync(async(req, res) => {
    const {id} = req.params;
    const {title, description, image, price, location, country} = req.body;
    await Listing.findByIdAndUpdate(id, {title, description, image, price, location, country});
    req.flash("success", "Listing Updated!");
    res.redirect(`/listing/${id}`)
})
)

router.delete('/:id', isLoggedIn, wrapAsync(async(req, res) => {
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect('/listing')
})
)

module.exports = router;