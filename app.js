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



app.listen(3000 , function(){
    console.log("Server is running at port 3000");
});


