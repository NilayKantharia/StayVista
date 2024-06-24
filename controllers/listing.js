const Listing = require("../models/listing");


module.exports.index = async(req, res) => {
    let allListing = await Listing.find({});
    res.render("./listing/index", {allListing});
}

module.exports.renderNewForm = (req, res) => {
    res.render("./listing/new")
}

module.exports.showListing = async(req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id).populate({path: "reviews", populate:{path: "author"} }).populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exists");
        res.redirect("/listing");
    }
    res.render("./listing/show", {listing});
}

module.exports.createListing = async(req, res, next) => {
    const {title, description, image, price, location, country} = req.body;
    const newListing = new Listing({title, description, image, price, location, country});
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listing")
}

module.exports.renderEditForm = async(req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exists");
        res.redirect("/listing");
    }
    res.render('./listing/edit', {listing});
}

module.exports.updateListing = async(req, res) => {
    const {id} = req.params;
    const {title, description, image, price, location, country} = req.body;
    await Listing.findByIdAndUpdate(id, {title, description, image, price, location, country});
    req.flash("success", "Listing Updated!");
    res.redirect(`/listing/${id}`)
}

module.exports.destroyListing = async(req, res) => {
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect('/listing')
}