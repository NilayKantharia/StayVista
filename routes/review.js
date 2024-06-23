const express = require('express');
const router = express.Router({mergeParams: true});
const Review = require('../models/reviews.js');
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require('../models/listing');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middlewares.js');


//post review
router.post("/", isLoggedIn, validateReview, wrapAsync(async(req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created!");
    res.redirect(`/listing/${listing._id}`);
})
);


//delete review
router.delete("/:reviewId",isLoggedIn, isReviewAuthor, wrapAsync(async (req, res) => {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listing/${id}`);
}))

module.exports = router;