
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _=require("lodash");
const https=require("https");
const mongoose = require("mongoose");  //require mongoose
mongoose.set('strictQuery', true); //related to mongoose idk

const homeStartingContentApp = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContentApp = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContentApp = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

// const postsApp=[];

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public"));
app.set('views', path.join(__dirname, 'views'));

// creating a new database in mongodb using mongoose
mongoose.connect("mongodb+srv://suraj-fusion:surajraj@cluster0.z5cqkyz.mongodb.net/BlogDB?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });

//creating a schema 
const postsSchema={
  title:String,
  content:String
};


const posts=mongoose.model("post",postsSchema); // the passed argument string gets automatically converted to posts















// -----------------------------------------------------------------------PATHS(ROUTES)------------------------------------------------------------------------
app.get("/",function(req,res){


 posts.find(function(err,founditems){
  
   if(err)
   {
    console.log("Error");
   }
   else{
    res.render("home",{homeStartingContent:homeStartingContentApp,posts:founditems}); //the default path set for render is directory/views
   }

 });



});

app.get("/about",function(req,res){
  res.render("about",{aboutContent:aboutContentApp});
});

app.get("/contact",function(req,res){
  res.render("contact",{contactContent:contactContentApp});
});


app.get("/compose",function(req,res){
  res.render("compose");
});


app.post("/compose",function(req,res){

  //  const post={ postTitleApp:req.body.postTitle,postContentApp:req.body.postContent };
  //  postsApp.push(post);

  const post1=new posts({
    title:req.body.postTitle,
    content:req.body.postContent
  });
  postarr=[];

  postarr.push(post1);
  posts.insertMany(postarr,function(err){
    if(err){
      console.log("error");
    }
    else
    {
      console.log("posts added to database");
    }

  });

  
  
  

  
   res.redirect("/");


});

app.get("/posts/:path",function(req,res){


   let path=req.params.path;
   console.log(path);

  
  posts.find({_id:path},function(err,founditems){
       
           if(err)
           {
            console.log("error");
           }
           else{
            console.log("match found");  
            res.render("post",{post:founditems});
           }

  });


});









app.listen(3000, function() {
  console.log("Server started on port 3000");
});
