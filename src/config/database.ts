import mongoose from "mongoose";
const connectionString = process.env.MONGODB_URI!

const dbConnect = async ()=> {
     mongoose.connect(connectionString)
     .then(()=> {
        console.log('connection to  mongoDB successful')
     })
     .catch((err: Error) =>{
console.log('Error connecting to mongoDB', err);

     })
}

export default dbConnect