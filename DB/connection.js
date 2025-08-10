import mongoose from "mongoose";


const connectDB = async () => {
    return await mongoose.connect(process.env.MONGO_DB_COMPASS_URL)
    .then(() => {
        console.log("Connected to DB")
    }).catch((err) => {
        console.log('Failed to connect to DB', err)
    })
}

export default connectDB