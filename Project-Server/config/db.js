import mongoose from 'mongoose';

const connectDB = async () => {
    const dbUsername = process.env.DB_USERNAME;
    const dbPassword = process.env.DB_PASSWORD;
    const dbURI = `mongodb+srv://${dbUsername}:${dbPassword}@grocerycluster.yowuvrv.mongodb.net/grocery_db?retryWrites=true&w=majority`;
    try {
        const conn = await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;