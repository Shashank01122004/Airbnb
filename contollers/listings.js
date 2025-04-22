const { model } = require("mongoose");
const Listing=require("../models/listing.js")

// 1->INDEX ROUTE
module.exports.index=async (req,res)=>{
    const alllistings=await Listing.find({});
    res.render("listings/index.ejs",{alllistings});
};

//2 new route
module.exports.renderNewform=(req,res)=>{ 
    res.render("listings/new.ejs");
};

// Show route
module.exports.showroute=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id)
    .populate({path:"reviews",
        populate:{
            path:"author",
        }
    })
    .populate("owner");
    if(!listing){
        req.flash("error","Listing not Found!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
};

// 3 create new route 

module.exports.createNewRoute=async(req,res)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing=new Listing(req.body.listing);
    newListing.image={url,filename};
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings");
};

//4 Edit route

module.exports.EditRoute=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing not Found!");
        res.redirect("/listings");
    }
    let originalImageurl = listing.image.url.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs",{listing,originalImageurl});
};

// Update Route

module.exports.UpdateRoute=async(req,res)=>{
    let {id}= req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});// ... for deconstruting
    if(typeof req.file!="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
    req.flash("success","Updated Listing!");
    res.redirect(`/listings/${id}`);
};

// Delete route /listings/:id ke pass ayegi delete req
module.exports.DeleteRoute=async(req,res)=>{
    let {id}= req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Deleted Listing");
    res.redirect("/listings");
};

module.exports.search = async (req, res) => {
    let { countries } = req.query; // Get the user input from query string
    const alllistings = await Listing.find({
        country: { $regex: countries, $options: 'i' } // 'i' makes it case-insensitive
    });
    
    res.render("listings/index.ejs", { alllistings });
};
