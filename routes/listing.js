const express=require("express");
const router=express.Router();
const wrapasync=require("../utils/wrapasync.js");
const expresserror=require("../utils/expresserror.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner,validatelising}= require("../middleware.js")
const listingcontroller=require("../contollers/listings.js");
const multer  = require('multer')
const {storage}=require("../cloudconfig.js")
const upload = multer({storage})

// 1->INDEX ROUTE
// 3.1->Create Route
//using router.route to do some task on same route
router.route("/")
    .get(wrapasync(listingcontroller.index))
    .post(
        isLoggedIn,
        upload.single('listing[image]'),
        validatelising,
        wrapasync(listingcontroller.createNewRoute)
    );

router.route("/search").get(wrapasync(listingcontroller.search));

//3-> New  route
router.get("/new",isLoggedIn,listingcontroller.renderNewform);

// 2->SHOW ROUTE
//Update
// Delete route /listings/:id ke pass ayegi delete req
router.route("/:id")
    .get(wrapasync(listingcontroller.showroute))
    .put(isLoggedIn,isOwner,upload.single('listing[image]'),validatelising,wrapasync(listingcontroller.UpdateRoute))
    .delete(isLoggedIn,isOwner,wrapasync(listingcontroller.DeleteRoute)
    );

//4->Edit route

router.get("/:id/edit",isLoggedIn,isOwner,wrapasync(listingcontroller.EditRoute));


module.exports=router