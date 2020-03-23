import { MongoClient, Db, ObjectId } from 'mongodb';

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'myproject';

let db: Db;

export async function connect() {
  // Use connect method to connect to the server
  return MongoClient.connect(url).then(client => {
    db = client.db(dbName);
  });
}

export const insertResults = async (
  name: string,
  results: { [index: string]: number }
) => {
  let item = db.collection('results').insertOne({ name: name, results });
  return item;
};

export const findResults = async (id: ObjectId) => {
  let item = await db
    .collection('results')
    .findOne({ _id: id }, { projection: { _id: 0 } });
  return item;
};
