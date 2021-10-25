const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const app = express();
const ObjectId = require('mongodb').ObjectId;
console.log(ObjectId);
app.use(cors());
app.use(express.json());
const port = 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q5fov.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
async function run() {
	try {
		await client.connect();
		const database = client.db('carMechanic');
		const servicesCollection = database.collection('services');

		//GET API
		app.get('/services', async (req, res) => {
			const cursor = servicesCollection.find({});
			const services = await cursor.toArray();
			res.send(services);
		});

		//GET Single Service
		app.get('/services/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const service = await servicesCollection.findOne(query);
			res.json(service);
			console.log(id, service);
		});
		//POST API//
		app.post('/services', async (req, res) => {
			const service = req.body;
			const result = await servicesCollection.insertOne(service);
			res.json(result);
		});
		//DELETE API
		app.delete('/services/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const result = await servicesCollection.deleteOne(query);
			res.json(result);
		});
	} finally {
		// await client.close()
	}
}
run().catch(console.dir);

app.get('/', (req, res) => {
	res.send('eruweouriuower');
});

app.listen(port, () => {
	console.log('listening to port', port);
});
