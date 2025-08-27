import mongoose from "mongoose";
// let MONGODB_URL = 'mongodb+srv://noorulameen8606:<nsOvrJRPGxqo9h5Q>@cluster0.vpqghcv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
let MONGODB_URL = 'mongodb+srv://noorulameen8606_db_user:r88R9UTMZuLZdfGY@cluster0.ztubdyn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

const connectDB= async ()=>{
    mongoose.connection.on('connected',()=>{
            console.log('mongoDB connected successfully');
            
    })
    // await mongoose.connect(`${process.env.MONGODB_URL}/kokkachalWafyCollege`)
    await mongoose.connect(`${MONGODB_URL}/kokkachalWafyCollege`)


}

export default connectDB


// noorulameen8606_db_user
// r88R9UTMZuLZdfGY
// mongodb+srv://noorulameen8606_db_user:r88R9UTMZuLZdfGY@cluster0.ztubdyn.mongodb.net/
// mongodb+srv://noorulameen8606_db_user:r88R9UTMZuLZdfGY@cluster0.ztubdyn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0