import mongoose from 'mongoose';
import app from './src/app.js';

let server;
const HOST = "localhost";
const PORT = "8000"

const connect = async () => {
	try {
		await mongoose.connect("mongodb://127.0.0.1:27017/demodb", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            retryWrites: true,
            w: 'majority'
        });
		console.log('Connected to MongoDB');
		server = app.listen(PORT, HOST, () => {
			console.log(`host:${HOST} ,port: ${PORT}`);
		});
	} catch (err) {
		console.error(`MongoDB connection error: ${err}`);
	}
};

connect();
