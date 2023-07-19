
import jwt from "jsonwebtoken"
import  {User}  from "../db.js";

const auth = async (req,res,next)=>{
    try {
        const token = req.cookies.value;
        const verifyUser = jwt.verify(token, "thisismysecret")
        const user = await User.findOne({_id:verifyUser._id})
         if(user){
            next()
         }
        
    } catch (error) {
        res.status(400).send(error)
    }
}

export default auth;