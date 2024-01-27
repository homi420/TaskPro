import mongoose from "mongoose";
const MongoUri = process.env.MONGO_URI;
let isConnected = false;
const connectToDb = async () => {
  mongoose.set("strictQuery", true);
  if (isConnected) {
    console.log("DataBase CONNECTED ALREADY!");
    return;
  } else {
    try {
      await mongoose.connect(MongoUri);
      isConnected = true;
      console.log("connected to the db!");
    } catch (error) {
      console.log("Failed to connect to DB!");
      console.log(error);
    }
  }
};
export default connectToDb;
