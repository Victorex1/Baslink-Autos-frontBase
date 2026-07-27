require("dotenv").config();
const express = require("express");
const app = express();
const controller = require("./controller/auth");
const Router = require("./router/userRouter");
const passport = require('passport')
const cookies = require('cookie-session')
const passportStrategy = require('./controller/passportOauth')

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

const port = process.env.PORT || 5000;

app.use(cookies({
    maxAge:1000*60*60*24,
    keys:[process.env.cookiKEY]
}))

app.use(passport.initialize())
app.use(passport.session())

app.get("/", (req, res) => {
    res.redirect("/android-stereo");
});

// ejs engin
app.set("view engine", "ejs"); 
app.use("/android-stereo", Router);
app.post("/android/cart", controller.TocartDB);

// middleware
app.use(express.static("src"));
app.use(express.static("img"));
app.use(express.static("public"));
app.use(express.json());

app.listen(port, console.log(`listening at port: ${port}`));

