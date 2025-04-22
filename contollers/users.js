const User=require("../models/user.js");

module.exports.rendersignupform=(req, res) => {
    res.render("users/signup.ejs");
};

module.exports.Signup=async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);

    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
      if(err){
        return next(err);
      }
      req.flash("success", "Welcome to Travel Buddy");
      res.redirect("/listings");
    })
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.renderloginform=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login=async(req,res)=>{
    req.flash("success","You are logged in Travel BUddy!");
    let redirecturl=res.locals.redirectUrl ||"/listings";
    res.redirect(redirecturl);
};

module.exports.logout=(req,res)=>{
    req.logOut((err)=>{
      if(err){
        return next(err);
      }
      req.flash("success","You are logged out!");
      res.redirect("/listings");
    });
};