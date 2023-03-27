const mongoose = require("mongoose")
const userSchema = mongoose.Schema({
    name:String,
    email:String,
    city:String,
    password:String
},
    {
      versionKey: false
})

const Usermodel= mongoose.model("weathers",userSchema)

module.exports = {Usermodel}