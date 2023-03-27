const express=require("express")
const bcrypt=require("bcrypt")
const jwt = require("jsonwebtoken")
const {Usermodel}=require("../model/userModel.js")
const user_Router = express.Router();


const {createClient}=require('redis')

const client = createClient();

client.on('error', err => console.log('Redis Client Error', err));
client.connect()

user_Router.post("/signup",(req,res)=>{
    const {name,email,city,password}=req.body;
    try {
        bcrypt.hash(password,3,async function(err,hash){
         const data= new Usermodel({name,email,city,password:hash})
         await data.save()
         res.status(200).send("Signup Successfully")
        })
    } catch (error) {
       res.status(400).send("Signup Again")
    }
   
})

user_Router.post("/login",async(req,res)=>{
    const {email,password}=req.body;
    let user = await Usermodel.find({email})
    if(user.length>0){
        bcrypt.compare(password,user[0].password, async function(err,result){
            if(result){
                const token = jwt.sign({id:user[0]._id},"normaltoken")
                await client.set('token',token)

                res.status(200).send({
                    "msg":"Login Successfully",
                    token,
                })
            }else{
                res.status(400).send("Wrong Credentials")
            }              
   });
 }else{
    res.status(400).send("Create Account First")
 }
})

user_Router.get("/logout", async (req,res)=>{
    const token = await client.get('token')

    try {
        if(token){
            await client.lPush('Arr',token)
        }
    } catch (error) {
        console.log(error)
    }
    res.status(200).send("Logout BYE BYE...")
})

module.exports={
    user_Router
}
