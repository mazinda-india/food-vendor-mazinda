import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('connected')
    } catch (err) {
        console.err('Error while connecting to MongoDB : ' + err.message)
    }
}

export default connectDB;