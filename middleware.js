const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const expresserror = require("./utils/expresserror.js");
const { listingSchema, reviewSchema } = require("./schema.js"); // ✅ FIXED: add reviewSchema


module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        // save redirect url as ( previously we are redirecting in /listings)
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you are not logged in!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async (req,res,next)=>{
    let {id}= req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validatelising=(req,res,next)=>{
    let{error}=listingSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new expresserror(400,errmsg)
    }
    else{
        next();
    }
};

module.exports.validatereview=(req,res,next)=>{
    let{error}=reviewSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new expresserror(400,errmsg)
    }
    else{
        next();
    }
};

module.exports.isAuthor=async (req,res,next)=>{
    let {id,reviewid}= req.params;
    let rev=await Review.findById(reviewid);
    if(!rev.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}