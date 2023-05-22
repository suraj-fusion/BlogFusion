
//constants for importing Required modules and setting up different modules for use
const express = require("express");    

const bodyParser = require("body-parser"); 

const ejs = require("ejs");

const _=require("lodash");

require('dotenv').config()
var path = require('path');  //doubt


const mongoose = require("mongoose");

mongoose.set('strictQuery', true);  //ensures all queries are valid that means that all queries are in accordance with the defined Schema  



//Default content on different pages

const homeStartingContentApp = "Hello Fellow Earthlings..., Suraj this side , Welcome to BlogFusion where you can find blogs written specially by me on various topics i find interesting and worth sharing.Feel free to check them out..Peace Out!";
const aboutContentApp = "I am Suraj Raj A passionate Computer Science Student and and aspiring full Stack developer 😁.I have always been a student and learner at heart currently pursuing my bachelor's in CSE from ITER bhubaneshwar";
const contactContentApp = "E mail me at surajrajgp@gmail.com";

// const postsApp=[];

const app = express();   //creates app using express

app.set('view engine', 'ejs'); //setting up EJS.The viewengine component is set to render HTML from ejs templates files with .ejs extension inside views directory

app.use(bodyParser.urlencoded({extended: true})); //setting up body-parser.Through urlencoded method POST and PUT requests can be parsed.Setting extended to true means that it can parse nested objects and arrays as well rather than just simple key value pairs

app.use(express.static(__dirname+"/public")); //setting up express so that it recognises public as the directory name for static files.We use _dirname when hosting on vercel because in vercel we have to specify full path

app.set('views', path.join(__dirname, 'views')); //doubt


const md5 = require("md5");    //requiring md5







// creating a new database in mongodb using mongoose
mongoose.connect(process.env.MONGODB_KEY, { useNewUrlParser: true, useUnifiedTopology: true });   //The useNewUrlParser and useUnifiedTopology options are required to prevent deprecation warnings and to ensure that Mongoose uses the new connection logic introduced in MongoDB 3.0.

//creating a schema 
const postsSchema={
  title:String,
  content:String
};


const posts=mongoose.model("post",postsSchema); // the passed argument string gets automatically converted to posts





const userSchema= new mongoose.Schema({    //have to create proper mongoose schema to encrypt it 
  email:String,
  password:String
});

const users = new mongoose.model("user",userSchema);  // creating a model using the schema the passed argument users gets automatically converted to users



//code to register myself

  // const newUser=new users({
  //     email:"surajrajgp@gmail.com",
  //     password:md5(<my pasword>)    //creating hash using md5
  // });
 
  // newUser.save(function(err){
  //     if(err)
  //     {
  //         console.log(err);
  //     }
  //     else{
  //        console.log("successfully registered");
  //     }
  // });






// -----------------------------------------------------------------------ROUTES------------------------------------------------------------------------

//route to home (default route)
app.get("/",function(req,res){


 posts.find(function(err,founditems){
  
   if(err)
   {
    console.log("Error");
   }
   else{
    res.render("home",{homeStartingContent:homeStartingContentApp,posts:founditems}); //to pass data from backend(app.js) to frontend(home.ejs) we use JSON object 
   }

 });



});





//get route to about page
app.get("/about",function(req,res){
  res.render("about",{aboutContent:aboutContentApp});
});




//get route to contact page
app.get("/contact",function(req,res){
  res.render("contact",{contactContent:contactContentApp});
});




app.get("/login",function(req,res){

  res.render("login");
  
});

app.post("/login",function(req,res){
  
    //checking if user exists in the data base is yes rendering compose webpage
    const email=req.body.email;
    const password=md5(req.body.password);  //recreating the same hash(if correct password is entered) 

    users.findOne({email:email},function(err,userfound){
        if(err)
        {
            console.log(err);
        }
        else
        {
            if(userfound){
              
              if(userfound.password==password){   // comparing if entered password gives equal hash or not for loggin in
                
                console.log("logged in"); 
                res.render("compose");
              }
              else
              {
                res.render("wrong_password");
              }
             
            }
            else
            {
              res.render("wrong_user");
            }
            
        }
    });

    

});






//get route to compose page
app.get("/compose",function(req,res){
  res.redirect("/login");
});





//post route to compose page
app.post("/compose",function(req,res){

  
  //creating an instance (object) of posts collection
  const post1=new posts({              
    title:req.body.postTitle,
    content:req.body.postContent
  });
  postarr=[];
  
  //pushing that object into an array
  postarr.push(post1);
  //inserting that array into posts collection using insertMany method another way to do it would be to use create method
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


//get route to specific posts
app.get("/posts/:path",function(req,res){


   let path=req.params.path;
  
  posts.find({_id:path},function(err,founditems){   //finding the specific post accordint to id and passing  that over to post ejs to be rendered
       
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




//setting up server to listem on port 3000
app.listen(3000, function() {
  console.log("Server started ");
});
