require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const md5 = require('md5');

const app = express();



app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static('public'));
app.set('view engine','ejs');

const uri = "mongodb+srv://yash1234:yash1234@cluster0.bxhpm.mongodb.net/userDB?retryWrites=true&w=majority";


mongoose.connect(uri,{useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
  console.log("Connection succesfull");
}).catch((err)=>{console.log(err)})


const userSchema = new mongoose.Schema({
    email : String,
    password : String
});

const User = new mongoose.model("User",userSchema);

app.get('/',(req,res)=>{
    res.render('home')
})

app.get('/login',(req,res)=>{
    res.render('login');
})

app.get('/register',(req,res)=>{
    res.render('register');
})

app.post('/register',(req,res)=>{
    const newUser = new User({
        email : req.body.username,
        password : md5(req.body.password)
    })

    newUser.save((err)=>{
        if(!err){
            res.render('secrets');
        }else{
            console.log(err);
        }
    })
})


app.post('/login',(req,res)=>{
    const username = req.body.username;
    const password = md5(req.body.password);

    

    User.findOne({email:username},(err,foundUser)=>{
        if(err){
            console.log(err);
        }else{
            if(foundUser){
                if(foundUser.password === password){
                    res.render('secrets');
                }
            }
        }
    })
})






app.listen(3000,()=>{
    console.log("Server started at port 3000...")
})
