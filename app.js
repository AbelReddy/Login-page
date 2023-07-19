import express from "express"
import ejs from "ejs"
const app = express();
import { connectDB,User } from "./db.js";
import cookieParser from "cookie-parser";
import auth from "./model/auth.js";
import bcrypt from "bcrypt";
const saltRounds =  10;
import jwt from "jsonwebtoken"


app.use(express.json())
app.use(cookieParser())
app.set("view engine","ejs")
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}));


connectDB();

app.get("/", async (req,res)=>{
   res.status(200).render("home")
})

app.get("/login",async (req,res)=>{    
    res.render("login",{message:""})
})

app.post("/login",async (req,res)=>{
    const email = req.body.name;
    const password = req.body.password;
    


    const user = await User.findOne({email})
  
    if(user){
         bcrypt.compare(password,user.password,(err, result) => {
                 if(result===true){
                    const token =  jwt.sign({ _id: user.id }, "thisismysecret", { expiresIn: 40000 })
        res.cookie("value",token,{
            expire:40000 + Date.now(),
            secure:true,
            httpOnly:true
        }) 
        res.render("success")
                 }
                 if(result===false) res.status(401).json("password is wrong")
             })  
         
    } else{
        res.render("login", {message:"Please register first"})
    }
              
        })
    

app.get("/register",async (req,res)=>{
    res.render("register")
})
app.post("/register", async (req,res)=>{
    const {name,email,password} = req.body;
   bcrypt.hash(password,saltRounds, async (err,hash)=> {
     const user = await User.create({name,email,password:hash})
   const token =  jwt.sign({ _id: user.id }, "thisismysecret", { expiresIn: 40000 })
   console.log(token)
        
        res.cookie("value",token,{
            expire:40000 + Date.now(),
            secure:true,
            httpOnly:true
        })
    
        res.render("success")
     })
   })

app.get("/success", (req,res)=>{
res.redirect("/")
})

app.get("/bankdetails", (req,res)=>{
    const token = req.cookies.value
    if(token){
        res.render("bankdetails")
    } else{
        res.render("login",{message:"your session has expired"})
    }
  
})

app.get("/accountdetails",auth,(req,res)=>{
    res.render("accountdetails")
})



app.get("/logout",(req,res)=>{
    res.cookie("value", '',{
      expire:new Date(Date.now)  
    })
    res.redirect("/")
})





app.listen("3000", ()=>{
    console.log("server is started")
})