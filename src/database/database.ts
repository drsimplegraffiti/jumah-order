import * as mongoose from 'mongoose';

mongoose.set('strictQuery', true);
export let connectDatabase = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce');  // <--- change this to your database name and use environment variables
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