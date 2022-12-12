import * as mongoose from "mongoose";


mongoose.set('strictQuery', true);
export let connectDatabase = async () => {
    try {
        let db_url = process.env.MONGO_URI;
        // @ts-ignore
        await mongoose.connect(db_url);  // <--- change this to your database name and use environment variables
        console.log('Database connected');
    } catch (error) {
        console.log('Database connection error');
        console.log(error);
     }


}

export let disconnectDatabase = () => {  
    console.log('Database disconnected');
    mongoose.disconnect();
}