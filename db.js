import mongoose from "mongoose"

const schema = new mongoose.Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
        lowercase:true,
        require:"Email address is required"

    },
    password:{
        type:String,
        required:true
    }
})
   
export const connectDB = async ()=>{
await mongoose.connect('mongodb+srv://abelrdd9:3DqEndp68wDT3dtO@cluster0.avevcm1.mongodb.net/experiment?retryWrites=true&w=majority')
.then (()=>{console.log("Database is connected")}),
err => { console.log(err)}
}

export const User = mongoose.model("User", schema)