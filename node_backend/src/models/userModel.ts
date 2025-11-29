import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }, email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
    }, image: {
        type: String,
        default: ""
    }, interviewData: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Interview"
        }
    ] 
});

const User = mongoose.model("User", userSchema);

export default User;