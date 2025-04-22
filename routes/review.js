const express=require("express");
const router = express.Router({ mergeParams: true });
const wrapasync=require("../utils/wrapasync.js");
const expresserror=require("../utils/expresserror.js");
const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const {validatereview,isLoggedIn,isAuthor}= require("../middleware.js")
const reviewcontoller=require("../contollers/reviews.js");


// 5 Reviews
// post  review route
router.post("/",isLoggedIn,validatereview,wrapasync(reviewcontoller.postReview));

// delete review route
router.delete("/:reviewid",isLoggedIn,isAuthor,
    wrapasync(reviewcontoller.deletereview));


module.exports=router;