import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (!uri) {
  console.warn(
    "WARNING: MONGODB_URI environment variable is not defined. NextAuth MongoDB adapter will be disabled."
  );
}

if (uri) {
  if (process.env.NODE_ENV === "development") {
    // Prevent creating multiple connections during hot-reloads
    let globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
} else {
  // Fallback promise for compilation safety if URI is absent
  clientPromise = new Promise(() => {});
}

export default clientPromise;
