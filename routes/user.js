const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapasync=require("../utils/wrapasync.js");
const passport = require("passport");
const {saveRedirectUrl}=require("../middleware.js")
const usercontroller=require("../contollers/users.js");

router.get("/signup", usercontroller.rendersignupform);

router.post("/signup", usercontroller.Signup);

router.get("/login",usercontroller.renderloginform);

//passport.authenticate() is a middleware used to authenticate a user (i.e present or not)
router.post("/login",saveRedirectUrl,passport.authenticate('local',{failureRedirect:"/login",failureFlash:true}),usercontroller.login);

router.get("/logout",usercontroller.logout);

module.exports = router;
