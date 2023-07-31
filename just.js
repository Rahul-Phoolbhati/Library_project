const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const mongoose = require('mongoose');


const app = express();
// databases connect

const mongoDB = "mongodb+srv://Jazzy49:MyNodeApp@nodeprojects.tsxlcqi.mongodb.net/Imagine?retryWrites=true&w=majority";

main()
.then(()=>console.log("conneceted"))
.catch((err)=>console.error(err));
async function main(){
    await mongoose.connect(mongoDB);
}

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, "Name is required!!!"],
    },
    email: {
      type: String,
      required: [true, "Email is required!!!"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required!!!"],
      minlength: [6, "Password length should be 6 character long"],
    },
});
const userModel = mongoose.model("User", userSchema);

app.get('/', async (req,res)=>{
    const data = await userModel.find()
    res.json({data})
})
app.listen(3000,()=>{
    console.log("running on port 3000");
})
