const User = require('../models/user');

module.exports.renderSignUpForm = (req, res) => {
    res.render('users/signup');
}

module.exports.createUser = async (req, res) => {
    try{
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to StayVista!");
            res.redirect("/listing");
        })
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }

}

module.exports.renderLoginPage = (req, res) => {
    res.render('users/login');
}

module.exports.login = async (req, res) => {
    req.flash("success","Welcome to StayVista");
    res.redirect(res.locals.redirectURL || "/listing");
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if(err)
            next(err);
    req.flash("success", "you are logged out!");
    res.redirect("/listing");
    })
}