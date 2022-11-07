const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());



app.get('/', (req, res) => {
	res.send('Assignment Eleven Server is Running  check');
});



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.y0hhy5e.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1,
});

async function run() {
	try {
		const servicesCollection = client.db('photoCollection').collection('services');

			app.get('/services', async (req, res) => {
				const query = {};
				const cursor = servicesCollection.find(query);
				const services = await cursor.toArray();
				res.send(services);
			});
	}
	finally {
		
	}
}
run().catch(err => console.error(err));



app.listen(port, () => {
	console.log(`Assignment Eleven Server Listening on Port ${port}`);
});
