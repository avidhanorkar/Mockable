import mongoose from "mongoose";

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        console.log("MONGO URI Not Found!!");
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongo DB Connected Successfully");
    } catch (error) {
        console.log("Error occured during connecting the database: ", error);
        process.exit(1)
    }
}

export default connectDB;