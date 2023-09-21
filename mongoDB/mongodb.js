const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@vehicleservicelogcluste.no66rrt.mongodb.net/VSL-DB?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Successfully connected to the DB");
    } catch (error) {
        console.error("Failed to connect to the DB:", error);
        throw error;
    }
}

module.exports = {
    client,
    connectToDatabase
};
