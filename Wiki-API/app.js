const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const { request } = require("express");

const router = express.Router();
module.exports = router ;

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs');
app.use(express.static("public"));



mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("Article", articleSchema);
///////////////////////////////////////////////////// all articles


app.route("/articles")
    .get(function(req, res){
        Article.find(function(err, foundArticles){
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }
        })
    })
    .post(function(req, res){
    var newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    })
    newArticle.save(err=>{
        if(!err){
            res.send("Saved");
        } else {
            res.send(err)
        }
    })
    })
    .delete(function(req, res){
            Article.deleteMany(function(err){
                if (!err) {
                    res.send("deleted all");
                } else {
                    res.send(err)
                }
            })
        })
//////////////////////// specific article

 app.route("/articles/:articleTitle")
        .get(function(req, res){
            Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
                if(!err){
                    res.send(foundArticle);
                } else {
                    res.send(err)
                }
            })
        })
        .put(function(req, res){
            Article.updateOne(
                {title: req.params.articleTitle},
                {title: req.body.title, content: req.body.content}, function(err){
                    if(!err){
                        res.send("Updated")
                    } else {
                        res.send(err);
                    }
                }
            )
        })
        .patch(function(req, res){
            console.log(req.body)
            Article.updateOne(
                {title: req.params.articleTitle},
                {$set: req.body},
            function(err){
                if (!err) {
                    res.send("Successfully updated article");
                } else {
                    res.send(err);
                }
            }
            );
            })
        .delete(function(req, res){
            Article.deleteOne({title: req.params.articleTitle},function(err){
                if(!err){
                    res.send("Deleted");
                } else {
                    res.send(err)
                }
            })
        })

app.listen(3000, function(){
    console.log("Server started on port 3000.")
})