if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride = require('method-override');
const ejsmate=require("ejs-mate");
const expresserror=require("./utils/expresserror.js");
const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");


// ******important line as all the listings requests are saved inside routes folder listings.js and is mapped 
const listingsrout=require("./routes/listing.js");
const reviewsrout=require("./routes/review.js");
const userrout=require("./routes/user.js");
const { processColor } = require('react-native-reanimated');



const dburl=process.env.ATLASDB;

main().then((res)=>{
    console.log("connected to DB");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect(dburl);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine("ejs",ejsmate);
// to use css
app.use(express.static(path.join(__dirname,"/public")))

const store=MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.secret,
    },
    touchAfter:24*3600,
});

store.on("error",()=>{
    console.log("ERROR in MONGO SESSON STORE..",err);
});

const sessionoptions={
    // secret is used to wrap the datas so that any modification done can be reflected
    store,
    secret:process.env.secret,
    resave:false,
    saveUninitialized:true,
    //we want ot delete the curretn cookie on the expires time
    cookie:{
        expires:Date.now()+1000*60*60*24*8,// milliseconds so that it expires after 8 days
        maxAge:1000*60*60*24*3,
        httpOnly:true,// defalut set to true always
    },
};



app.use(session(sessionoptions));// session is used to check that if same application open in diff tabs then it is same user or not
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());// so that user need not to again login in same session

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// middleware defined
// locals It’s request-scoped, meaning it exists only for the lifetime of a single request and response cycle. 
app.use((req,res,next)=>{
    res.locals.success= req.flash("success");
    //You can assign properties to res.locals in middleware, and those values will be accessible in your route handlers and view templates.
    res.locals.error= req.flash("error");// it can be accessed by the name complete
    res.locals.currUser=req.user;
    next();
});


// ***** here we mapped /listings path with the listing.js(routes)
app.use("/listings",listingsrout)
app.use("/listings/:id/reviews",reviewsrout);
app.use("/",userrout)


app.all("*",(req,res,next)=>{
    next(new expresserror(404,"Page Not Found!"));
})

app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something went Wrong"}=err;
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
});

app.listen(8080,()=>{
    console.log("listening to port 8080");
});