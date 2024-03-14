import mongoose from "mongoose";

const dbConnection = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGODB__URL)
        console.log('Database connected')
    } catch (error) {
        console.log(error);
    }
}

export default dbConnection