const mongoose = require('mongoose');
const colors = require('colors')

const connectDB = async() =>{
    try{
        await mongoose.connect(process.env.MONGO_URI,{
            usenewUrlParser: true,
            useUnifiedTopology: true,
        })
          console.log(`Connected to MongoDB Database ${mongoose.connection.host}`.cyan.bold.underline)
    }catch(error){
        console.log(`Error : ${error.message}`.red.bold);
    }
} 

module.exports = connectDB