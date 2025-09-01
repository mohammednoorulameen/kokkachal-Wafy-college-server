import mongoose from "mongoose";

let MONGODB_URL ="mongodb+srv://noorulameen8606_db_user:uvpNKZYNRui4t5Zj@cluster0.88fdf49.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("mongoDB connected successfully");
  });
  // await mongoose.connect(`${process.env.MONGODB_URL}/kokkachalWafyCollege`)
  await mongoose.connect(`${MONGODB_URL}/kokkachalWafyCollege`);
};

export default connectDB;

// latest

// uvpNKZYNRui4t5Zj
// noorulameen8606_db_user
