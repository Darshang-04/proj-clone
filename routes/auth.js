const express = require('express')
const route = express.Router()
const mongoose = require('mongoose')
const USER = mongoose.model("USER")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { jwt_secret } = require('../keys')
const requireLogin = require('../middleware/requireLogin')


route.post('/signup',(req,res)=>{
    const {name, username, email, password} = req.body
    if(!name || !username || !email || !password){
        return res.status(422).json("please fill all the fields")
    }
    USER.findOne({$or:[{email:email},{username:username}]}).then((saved)=>{
        if(saved){
            return res.status(422).json({error:"you enter email or username already exsit! please try others"})
        }
        bcrypt.hash(password, 12).then((hashedpassword)=>{
            const user = new USER({
                name,
                username,
                email,
                password: hashedpassword
            })
            user.save()
                .then(user =>{res.json({message:"Successfully connected"})})
                .catch(err =>{console.log(err)})
        })
        
    })
})
route.post('/signin',(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        return res.status(422).json({error:"please enter email and password!"})
    }

    USER.findOne({email:email}).then((savedUser)=>{
        if(!savedUser){
            res.status(422).json({error:"Invalid Email!"})
        }
        bcrypt.compare(password, savedUser.password).then((match)=>{
            if(match){
                // res.status(200).json({message:"Successfully Login!"})
                const token=jwt.sign({_id:savedUser.id},jwt_secret)
                const {_id,name,email,username} = savedUser
                res.json({token, user:{_id,name,email,username}})
                // console.log({token, user:{_id,name,email,username}})
            }
            else{
                res.status(422).json({error:"Invalid Cradential!"})
            }
        })
            
        }
    )
})

module.exports = route;