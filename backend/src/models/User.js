const mongoose=require('mongoose')

const UserSchema= new mongoose.Schema(
    {
        email:{
            type:String,
            required:true,
            unique:true,
        },
        fullName:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true,
            min:6,
        },
        profilePic:{
            type:String,
            default:"",
        }
    },{timestamps:true});

const UserModel = mongoose.model('User', UserSchema)

module.exports= UserModel;