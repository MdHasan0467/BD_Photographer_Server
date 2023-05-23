const express = require('express');
const cors = require('cors');
// const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dewgdxt.mongodb.net/?retryWrites=true&w=majority`;

// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const uri = "mongodb+srv://MdHasan:Yn8TqCyRQ5HBpL4q@cluster0.dewgdxt.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });









//! JWT verify ....

// function verifyJWT(req, res, next) {
// 	const authHeader = req.headers.authorization;
// 	if (!authHeader) {
// 		return res.status(401).send({ message: 'unauthorized access' });
// 	}
// 	const token = authHeader.split(' ')[1];
// 	jwt.verify(token, process.env.ACCESS_JWT_TOKEN, function (err, decoded) {
// 		if (err) {
// 			return res.status(401).send({ message: 'unauthorized access' });
// 		}
// 		req.decoded = decoded;
// 		next();
// 	});
// }

async function run() {
	try {
		const servicesCollection = client.db('photoCollection').collection('services');
		const reviewCollection = client.db('photoCollection').collection('reviews');

		//! receive the request from the client side and give him a JWT token...
		// app.post('/jwt', (req, res) => {
		// 	const user = req.body;
		// 	const token = jwt.sign(user, process.env.ACCESS_JWT_TOKEN, {
		// 		expiresIn: '5',
		// 	});
		// 	res.send({ token });
		// });

		//! All services are available...



		app.get('/services', async (req, res) => {
			const query = {};
			const cursor = servicesCollection.find(query);
			const services = await cursor.toArray();
			res.send(services);
		});




		// ! Gallery Services collection...
		app.get('/GalleryServices', async (req, res) => {
			const query = {};
			const cursor = servicesCollection.find(query);
			const services = await cursor.limit(5).toArray();
			res.send(services);
		});





		// ! three services collection...
		// app.get('/service', async (req, res) => {
		// 	const query = {};
		// 	const count = await servicesCollection.estimatedDocumentCount(query);
		// 	const cursor = servicesCollection.find(query);
		// 	const services = await cursor.skip(parseInt(count) - 3).toArray();
		// 	res.send(services);
		// });
		app.get('/service', async (req, res) => {
			const query = {};
			const cursor = servicesCollection.find(query);
			const services = await cursor.toArray();
			res.send(services);
		});




		// ! Service details....
		app.get('/service/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: new ObjectId(id) };
			const service = await servicesCollection.findOne(query);
			res.send(service);
		});






		// ! Add a new service....
		app.post('/services', async (req, res) => {
			const services = req.body;
			console.log(services);
			const result = await servicesCollection.insertOne(services);
			res.send(result);
		});





		// ! Review Post....
		app.post('/reviews', async (req, res) => {
			const reviews = req.body;
			const result = await reviewCollection.insertOne(reviews);
			res.send(result);
		});




		// ! Individually users Review By checking email ....
		app.get('/reviews', async (req, res) => {
			let query = {};
			if (req.query.email) {
				query = { email: req.query.email };
			}
			const cursor = reviewCollection.find(query);
			const reviews = await cursor.toArray();
			res.send(reviews);
		});




		// !  Individually users Review by ID ....
		app.get('/reviews/:id', async (req, res) => {
			const id = req.params.id;
			const query = { ServiceId: id };
			const cursor = reviewCollection.find(query);
			const reviews = await cursor.toArray();
			res.send(reviews);
		});




		// ! Delete
		app.delete('/reviews/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: new ObjectId(id) };
			const result = await reviewCollection.deleteOne(query);
			res.send(result);
		});

	


		// ! This is CRUD => U = Create //TODO: Update root
		app.get('/update/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: new ObjectId(id) };
			const result = await reviewCollection.findOne(query);
			res.send(result);
		});





		// ! Update value by Put/patch
		app.put('/update/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: new ObjectId(id) };
			const review = req.body;
			const option = { upsert: true };
			const updatedReview = {
				$set: {
					message: review.message,
				},
			};
			const result = await reviewCollection.updateOne(query,updatedReview,option);
			res.send(result);
		});
	} finally {
	}
}
run().catch((err) => console.error(err));


app.get('/', (req, res) => {
	res.send('Assignment Eleven Server is Running  check');
});



app.listen(port, () => {
	console.log(`Assignment Eleven Server Runing on Port ${port}`);
});
