const express= require("express");
const bodyParser= require("body-parser");
const mongoose= require("mongoose");

const app=express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/articleDB', {useNewUrlParser: true, useUnifiedTopology: true });

const articleSchema= {
    title: String,
    content: String
}

const Article=mongoose.model("Article",articleSchema);

const art1=new Article({
    title: "Headline",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
});

const art2=new Article({
    title: "Headline",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
});
const art3=new Article({
    title: "Headline",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
});
const art4=new Article({
    title: "Headline",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
});

const artArr=[art1,art2,art3,art4];

const userSchema={
    username: String,
    password: String
};

const User=mongoose.model("User", userSchema);


app.get("/",function(req,res){
    Article.find({},function(err,postedArticle){

        if(postedArticle.length===0)
        {
            Article.insertMany(artArr,function(err){
                if(err)
                console.log(err);
                else
                console.log("Successfully saved");
                res.redirect("/");
            });
        }
        else
        res.render("index", {articleObj: postedArticle});
    })
    
})

app.get("/compose",function(req,res){
    res.render("compose");
    
})




app.post("/compose", function(req,res){

   
    var a ={
        newHeadline: req.body.headline,
        newArticle: req.body.articleContent
    }
    
    const artNew= new Article({
        title: a.newHeadline,
        content:a.newArticle
    });

  artNew.save();
   res.redirect("/");
});

app.get("/afterlogin",function(req,res){
    Article.find({},function(err,postedArticles){

        if(postedArticles.length===0)
        {
            Article.insertMany(artArr,function(err){
                if(err)
                console.log(err);
                else
                console.log("Successfully saved");
                res.redirect("/afterlogin");
            });
        }
        else
        res.render("afterlogin", { articleObjLog: postedArticles });
    })
    
})

app.get("/login",function(req,res){
    res.render("login");
    
})

app.post("/login",function(req,res){
    const username= req.body.email;
    const password= req.body.password;

    User.findOne({username: username}, function(err,foundUser){
        if(err)
        {
            console.log(err);
        }
        else{
            if(foundUser){
            if(foundUser.password===password)
            {
                res.redirect("/afterlogin");
            }
        }
        }
    })
})

app.get("/signup",function(req,res){
    res.render("signup");
    
})
app.post("/signup",function(req,res){
    const newUser=new User({
        username: req.body.email,
        password: req.body.password
    });

    newUser.save(function(err){
        if(err)
        {
            console.log(err);
        }
        else{
            res.redirect("/afterlogin");
        }
    });
});
app.get("/myarticles",function(req,res){
    res.render("myarticles");
    
})
app.get("/articlefull",function(req,res){
    res.render("articlefull");
    
})


app.listen(5000 , function(){
    console.log("Server is running at port 5000");
});