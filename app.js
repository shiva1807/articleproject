const express= require("express");
const bodyParser= require("body-parser");
const mongoose= require("mongoose");
const _=require("lodash");
const { method } = require("lodash");

const app=express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/articleDB', {useNewUrlParser: true, useUnifiedTopology: true });

const articleSchema= {
    title: String,
    content: String,
    username:String
}

var user='0';

const Article=mongoose.model("Article",articleSchema);

const art1=new Article({
    title: "VOLCANIC CO2 EMISSIONS TRIGGERED TRIASSIC EXTINCTION",
    content: "Volcanic emissions played a direct role in the extreme climate change that led to the extinction of almost half of all species at the end of the Triassic period 201 million year ago, according to a new study.",
    username:'0'
});

const art2=new Article({
    title: "NEW MODEL COULD EXPLAIN ICY BLAST FROM JUPITER’S MOON",
    content: "On Europa, powerful eruptions may spew into space, raising questions among hopeful astrobiologists on Earth: What would blast out from miles-high plumes? Could they contain signs of extraterrestrial life? And where in Europa would they originate?",
    username:'0'
});
const art3=new Article({
    title: "MASS EXTINCTIONS HAPPEN EVERY 27 MILLION YEARS",
    content: "The cycle of mass extinctions of land-dwellers—including amphibians, reptiles, mammals, and birds—coincide with previously reported mass extinctions of ocean life, the researchers report.",
    username:'0'
});
const art4=new Article({
    title: "TINY FOX BONES ARE CLUES TO HUMAN EVOLUTION",
    content: "Nearly two decades ago, a small-bodied “human-like” fossil, Homo floresiensis, was discovered on an island in Indonesia. Some scientists have said the find, now nicknamed “Hobbit,” is representative of a human ancestor who developed dwarfed features after living on the island. ",
    username:'0'
});

const artArr=[art1,art2,art3,art4];

const userSchema = {
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
            {   user=foundUser._id;
                console.log(user);
                res.redirect("/afterlogin");
            }
            else{
                res.send("Login Failed");
            }
        }
        else{
            res.send("Login Failed");
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

    newUser.save(function(err,newuser){
        if(err)
        {
            console.log(err);
        }
        else{
            user=newuser._id;
            console.log(user);
            res.redirect("/afterlogin");
        }
    });
});


app.post("/compose", function(req,res){

   
    var a ={
        newHeadline: req.body.headline,
        newArticle: req.body.articleContent,
        writtenBy:user
    }
    
    const artNew= new Article({
        title: a.newHeadline,
        content:a.newArticle,
        username:a.writtenBy
    });
    
  artNew.save();
   res.redirect("/afterlogin");
});

app.get("/myarticles",function(req,res){
    Article.find({},function(err,postedArticle){

        
                if(err)
                console.log(err);
                else
                res.render("myarticles", {articleObj: postedArticle, user:user});
    });
    
});


app.get("/post/:headline",function(req,res){
    var id=req.params.headline;
    Article.findById(id, function(err,foundUser){
        if(err)
        {
            console.log(err);
        }
        else{
            res.render("post",{
                title:foundUser.title,
                content:foundUser.content
            })
        }
        
    });

})

app.get('/delete/:id', function(req, res) {
    var id=req.params.id;
    Article.findByIdAndDelete(id, function (err, deletedArticle) {
       if(err){
           console.log(err);
       }
       else{
        res.redirect("/afterlogin"); 
       }
              
     });
});


app.listen(5000 , function(){
    console.log("Server is running at port 5000");
});