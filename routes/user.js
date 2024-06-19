const express = require('express');
const router = express.Router();
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');

router.get('/signup', (req, res) => {
    res.render('users/signup');
})

router.post('/signup', wrapAsync(async (req, res) => {
    try{
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        req.flash("success", "Welcome to StayVista!");
        res.redirect("/listing");
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }

})
);

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login', passport.authenticate("local", {failureRedirect: '/login', failureFlash: true}), async (req, res) => {
    req.flash("success","Welcome to stayvista");
    res.redirect("/listing");
})

//logout
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if(err)
            next(err);
    req.flash("success", "you are logged out!");
    res.redirect("/listing");
    })
})

module.exports = router;