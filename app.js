//jshint esversion:6
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = new express();
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

//////////////////////////////////connection to mongodb///////////////////////////

mongoose.connect('mongodb://127.0.0.1:27017/userDB');

const userSchema = new mongoose.Schema({
    email : String,
    password : String
});

userSchema.plugin(encrypt, { secret: process.env.SECRETS, excludeFromEncryption: ["email"] });

const User = mongoose.model('User', userSchema);

/////////////////////////////Get route///////////////////////////////////

app.get("/", (req, res)=>{
    res.render("home");
})

app.get("/login", (req, res)=>{
    res.render("login");
})

app.get("/register", (req, res)=>{
    res.render("register");
});

////////////////////////////////Register route////////////////////////////

app.post("/register", (req, res)=>{
    const newUser = new User({
        email : req.body.username,
        password : req.body.password
    });

    newUser.save().then((ack)=>{
        console.log(ack);
        res.render("secrets");
    }).catch((err)=>{
        console.log(err);
    });
});

//////////////////////////////login route//////////////////////////////////

app.post("/login", (req, res)=>{
    User.findOne({ email : req.body.username}).then((ack)=>{
        if(ack.password === req.body.password){
            res.render("secrets");
        }else{
            console.log("password not matched")
        }
    }).catch((err)=>{
        console.log(err);
    });
});


//////////////////////////////server listen/////////////////////////////
app.listen(3000, ()=>{
    console.log("Server running on port 3000");
})