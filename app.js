
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const encrypt = require("mongoose-encryption");


mongoose.set('strictQuery', true);
mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
});



userSchema.plugin(encrypt, {secret:process.env.SECRET, encryptedFields:["password"]});

const User = mongoose.model("User", userSchema);

app.use(bodyParser.urlencoded({extended: true}));



app.set("view engine", "ejs");

app.use(express.static("static"));

app.get("", function(req, res){
    res.render("home")
})

app.get("/login", function(req, res){
    res.render("login");
});


app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })

    newUser.save(function(err){
        if (err){
            console.log(err);
        } else {
            res.render("secrets");
        }
    });

    
});

app.post("/login", function(req, res){
    var username = req.body.username;
    var password = req.body.password;

    User.findOne({email:username}, function(err, found){
        if (err){
            console.log(err);
        } else {
            if (found){
                if (found.password === password){
                    res.render("secrets");
                }
            } else {
                res.redirect("/register");
            }
        }
    })
})





app.listen(3000, function(req, res){
    console.log("server started on port 3000")
})