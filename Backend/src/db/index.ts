import mongoose from "mongoose";

const connectDB =  async () => {
    const DB_NAME = process.env.DB_NAME || "rental";
    try {
        const connectInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log(`\n MongoDB connected !! DB HOST: ${connectInstance.connection.host}`);
    }
    catch(error) {
        console.log("MONGODB connection error: ", error);
        process.exit(1);
    }
}

export default connectDB;