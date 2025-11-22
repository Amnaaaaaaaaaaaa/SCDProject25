const { MongoClient } = require('mongodb');

// Hardcoded MongoDB connection (will move to .env later)
const MONGO_URI = "mongodb://localhost:27017";
const DB_NAME = "vaultdb";
const COLLECTION_NAME = "records";

let collection;

async function connectDB() {
  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    console.log('✓ Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    collection = db.collection(COLLECTION_NAME);
    
    return collection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

async function addRecord({ name, value }) {
  const newRecord = {
    id: Date.now(),
    name,
    value,
    createdAt: new Date().toISOString()
  };
  
  await collection.insertOne(newRecord);
  return newRecord;
}

async function listRecords() {
  return await collection.find({}).toArray();
}

async function updateRecord(id, newName, newValue) {
  const result = await collection.updateOne(
    { id: id },
    { $set: { name: newName, value: newValue } }
  );
  return result.modifiedCount > 0;
}

async function deleteRecord(id) {
  const result = await collection.deleteOne({ id: id });
  return result.deletedCount > 0;
}

async function searchRecords(keyword) {
  const lowerKeyword = keyword.toLowerCase();
  return await collection.find({
    $or: [
      { name: { $regex: keyword, $options: 'i' } },
      { value: { $regex: keyword, $options: 'i' } },
      { id: parseInt(keyword) || 0 }
    ]
  }).toArray();
}

module.exports = {
  connectDB,
  addRecord,
  listRecords,
  updateRecord,
  deleteRecord,
  searchRecords
};
