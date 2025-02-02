import mongoose from "mongoose";

const connectDb = async() => {
  try {
    const response =await mongoose
    .connect(process.env.MONGODB_URI, {
        maxPoolSize: 3,
        minPoolSize: 2,
    })
    if(!response)
    {
      console.log("Something Problem while Connect DataBase....")
    }
    console.log("DataBase Connect SuccessFully....")
  } catch (error) {
    console.log("Something while connect The DataBase")
  }
        
};


export {connectDb}