const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middlewares');
const UserController = require('../controllers/user');

router.route('/signup')
    .get(UserController.renderSignUpForm)
    .post(wrapAsync(UserController.createUser));

router.route('/login')
    .get(UserController.renderLoginPage)
    .post(saveRedirectUrl, passport.authenticate("local", {failureRedirect: '/login', failureFlash: true}), UserController.login);

//logout
router.get("/logout", UserController.logout);

module.exports = router;