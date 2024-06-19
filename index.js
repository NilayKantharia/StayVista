const express = require('express');
require('dotenv').config();
const app = express();
const {connectToMongo} = require('./connection');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user.js');


const listingRouter = require('./routes/listing.js');
const reviewRouter = require('./routes/review.js')
const userRouter = require('./routes/user.js');

connectToMongo(process.env.mongoDBURL).then(() => console.log('MongoDB connected'));

app.set("view engine", "ejs");
app.engine('ejs',ejsMate)
app.set("views", path.join(__dirname, "views"));


app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
    secret: "thisissecret",
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}

app.get('/', (req, res) => {
    res.send("working!");
})

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

app.get("/demouser", async (req, res) => {
    let fakeUser = new User({
        email: "student@gmail.com",
        username: "demo-student"
    });
    let registeredUser = await User.register(fakeUser, "helloworld");
    res.send(registeredUser);
})

app.use('/listing',listingRouter);
app.use('/listing/:id/reviews', reviewRouter);
app.use('/', userRouter);


app.all('*', (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"))
})

app.use((err, req, res, next) => {
    let{statusCode = 500, message = "Something Went Wrong!"} = err;
    res.status(statusCode).render("error.ejs", {message})
    // res.status(statusCode).send(message)
})

app.listen(process.env.Port, () => console.log(`Server started at Port: ${process.env.Port}`))