const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
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
		const servicesCollection = client
			.db('photoCollection')
			.collection('services');
		const reviewCollection = client.db('photoCollection').collection('reviews');

		//! All services are available...
		app.get('/services', async (req, res) => {
			const query = {};
			const cursor = servicesCollection.find(query);
			const services = await cursor.toArray();
			res.send(services);
		});

		//! Gallery Services collection...
		app.get('/GalleryServices', async (req, res) => {
			const query = {};
			const cursor = servicesCollection.find(query);
			const services = await cursor.limit(5).toArray();
			res.send(services);
		});

		//! three services collection...
		app.get('/service', async (req, res) => {
			const query = {};

			const count = await servicesCollection.estimatedDocumentCount(query);
			const cursor = servicesCollection.find(query);
			const services = await cursor.skip(parseInt(count) - 3).toArray();
			res.send(services);
		});


		

		//! Service details....
		app.get('/service/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const service = await servicesCollection.findOne(query);
			res.send(service);
		});

		//! Add a new service....
		app.post('/services', async (req, res) => {
			const services = req.body;
			const result = await servicesCollection.insertOne(services);
			res.send(result);
		});

		//! Review Post....
		app.post('/reviews', async (req, res) => {
			const reviews = req.body;
			const result = await reviewCollection.insertOne(reviews);
			res.send(result);
		});

		//! Individually users Review ....
		app.get('/reviews', async (req, res) => {
			let query = {};
			if (req.query.email) {
				query = { email: req.query.email };
			}
			const cursor = reviewCollection.find(query);
			const reviews = await cursor.toArray();
			res.send(reviews);
		});

		//! Individually users Review by ID ....
		app.get('/reviews/:id', async (req, res) => {
			const id = req.params.id;
			const query = { ServiceId: id };
			const cursor = reviewCollection.find(query);
			const reviews = await cursor.toArray();
			res.send(reviews);
		});

		//! Delete
		app.delete('/reviews/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const result = await reviewCollection.deleteOne(query);
			res.send(result);
		});

		// //! Put for update
		// app.put('/update/:id', async (req, res) => {
		// 	const id = req.params.id;
		// 	const query = { _id: ObjectId(id) };
		// 	const updatedReview = req.body;
		// 	console.log(updatedReview);
		// });

		// // ! This is CRUD => U = Create //TODO: Update root
		// app.get('/users/:id', async (req, res) => {
		// 	const id = req.params.id;
		// 	const query = { _id: ObjectId(id) }; //! kon id k delete korte chai
		// 	const result = await userCollection.findOne(query);
		// 	res.send(result);
		// });

		// //! Update value by Put/patch
		// app.put('/users/:id', async (req, res) => {
		// 	const id = req.params.id;
		// 	const query = { _id: ObjectId(id) }; //! kon id k delete korte chai
		// 	const user = req.body;
		// 	const option = { upsert: true }; //! Value thakle Update korbe.. R na thakele Insert korbe
		// 	const updatedUser = {
		// 		$set: {
		// 			name: user.name,
		// 			email: user.email,
		// 			address: user.address,
		// 		},
		// 	};
		// 	const result = await userCollection.updateOne(query, updatedUser, option);
		// 	res.send(result);
		// 	// console.log(updatedUser)
		// });
	} finally {
	}
}
run().catch((err) => console.error(err));

app.listen(port, () => {
	console.log(`Assignment Eleven Server Listening on Port ${port}`);
});
