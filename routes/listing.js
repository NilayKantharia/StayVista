const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedIn, isOwner, validateListing } = require('../middlewares.js');
const ListingController = require("../controllers/listing.js");
const multer = require('multer');
const {storage} = require('../cloudConfig.js');
const upload = multer({storage});

router.route('/')
    .get(wrapAsync(ListingController.index))
    .post(isLoggedIn, upload.single("image"), validateListing, wrapAsync(ListingController.createListing));
    


router.get("/new", isLoggedIn, ListingController.renderNewForm);

router.route('/:id')
    .get(wrapAsync(ListingController.showListing))
    .put(isOwner, isLoggedIn, upload.single("image"), validateListing, wrapAsync(ListingController.updateListing))
    .delete(isOwner, isLoggedIn, wrapAsync(ListingController.destroyListing));


router.get('/:id/edit', isOwner, isLoggedIn, wrapAsync(ListingController.renderEditForm));

module.exports = router;