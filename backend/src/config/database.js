const mongoose=require('mongoose')
const dotenv=require('dotenv')

dotenv.config();

const MONGODB_URL=process.env.MONGODB_URL;

const connectDb= async ()=>{
    try{
        await mongoose.connect(MONGODB_URL);
    }
    catch(err){
        console.log(err);
    }
}

module.exports=connectDb;

