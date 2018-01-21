var express=require('express');
var app=express();
var bodyparser=require('body-parser');
var mongoose=require('mongoose');
var methodOverride=require('method-override');
var expressSanitizer=require('express-sanitizer');
var port=process.env.PORT;
// var promise = mongoose.connect('mongodb://localhost/blog', {
//     useMongoClient: true});
var promise = mongoose.connect('mongodb://username:password@ds111258.mlab.com:11258/restblog', {
    useMongoClient: true});
app.use(bodyparser.urlencoded({extended:true}));
app.use(expressSanitizer());        //This line must always be below body-parser
app.use(express.static("public"));
app.use(methodOverride("_method"));
//Mongoose model config
var schema=new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date,default:Date.now}
});
var Blog=mongoose.model("Blog",schema);
//Restful routes
// Blog.create({
//     title:"Post 1",
//     image:"https://images.unsplash.com/uploads/141219200475673afcb68/f5bd8360?auto=format&fit=crop&w=1350&q=80",
//     body:"This is the first post"
// });
app.get("/",function(req,res){
    res.redirect("/blogs");
});
app.post("/blogs",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,function(err,data){
        if(err){
            res.render("new.ejs");
        }
        else{
            res.redirect("/blogs");
        }
    });
});
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log(err);
        }
        else{
            res.render("index.ejs",{blogs:blogs});
        }

    });
});
app.get("/blogs/new",function(req,res){
    res.render("new.ejs");
});
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundblog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("show.ejs",{blog:foundblog});
        }
    });
});
app.put("/blogs/:id",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedblog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs/"+req.params.id);
        }
    });
});
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundblog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("edit.ejs",{foundblog:foundblog});
        }
    });
});
app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs");
        }
    });
});
app.listen(port,function(){
    console.log("Server is running");
});
