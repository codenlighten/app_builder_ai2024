import { connectCollection } from "./mongoConnect";

class MongoOperations {
  constructor() {
    // Collection cache to avoid repeated connections
    this.collectionCache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  async getCollection(collectionName) {
    const now = Date.now();
    const cached = this.collectionCache.get(collectionName);

    if (cached && now - cached.timestamp < this.cacheTimeout) {
      return cached.collection;
    }

    const collection = await connectCollection(collectionName);
    this.collectionCache.set(collectionName, {
      collection,
      timestamp: now,
    });

    return collection;
  }

  async executeOperation(collectionName, operation, errorMessage) {
    try {
      const collection = await this.getCollection(collectionName);
      return await operation(collection);
    } catch (error) {
      console.error(`${errorMessage}:`, error);
      return null;
    }
  }

  // Base CRUD operations
  async insertOne(collectionName, document) {
    return this.executeOperation(
      collectionName,
      (collection) => collection.insertOne(document),
      `Error inserting document into ${collectionName}`
    );
  }

  async insertMany(collectionName, documents) {
    return this.executeOperation(
      collectionName,
      (collection) => collection.insertMany(documents),
      `Error inserting documents into ${collectionName}`
    );
  }

  async findOne(collectionName, query) {
    return this.executeOperation(
      collectionName,
      (collection) => collection.findOne(query),
      `Error finding document in ${collectionName}`
    );
  }

  async findMany(collectionName, query = {}, options = {}) {
    try {
      const collection = await this.getCollection(collectionName);
      return await collection.find(query, options).toArray();
    } catch (error) {
      console.error(`Error finding documents in ${collectionName}:`, error);
      return [];
    }
  }

  async updateOne(collectionName, query, update, options = {}) {
    return this.executeOperation(
      collectionName,
      (collection) => collection.updateOne(query, update, options),
      `Error updating document in ${collectionName}`
    );
  }

  async deleteOne(collectionName, query) {
    return this.executeOperation(
      collectionName,
      (collection) => collection.deleteOne(query),
      `Error deleting document in ${collectionName}`
    );
  }

  async deleteMany(collectionName, query) {
    return this.executeOperation(
      collectionName,
      (collection) => collection.deleteMany(query),
      `Error deleting documents in ${collectionName}`
    );
  }
}

// Create singleton instance
const mongoOps = new MongoOperations();

// Domain-specific operations organized by category
const TransactionOps = {
  add: (tx) => mongoOps.insertOne("transactions", tx),
  getByTxid: (txid) => mongoOps.findOne("transactions", { txid }),
  getAll: () => mongoOps.findMany("transactions"),
  getByEmail: (email) =>
    mongoOps.findMany("transactions", { senderAddress: email }),
  getByUUID: (uuid) =>
    mongoOps.findOne("transactions", { senderAddress: uuid }),
};

const OTPOps = {
  add: (otpData) => mongoOps.insertOne("otp", otpData),
  find: (code) => mongoOps.findOne("otp", { otp: code }),
  delete: (code) => mongoOps.deleteOne("otp", { otp: code }),
};

const MemberOps = {
  add: (member) => mongoOps.insertOne("members", member),
  findByEmail: (email) => mongoOps.findOne("members", { email }),
  findAll: () => mongoOps.findMany("members"),
  update: (email, details) =>
    mongoOps.updateOne("members", { email }, { $set: details }),
  findByHandle: (handle) => mongoOps.findOne("members", { handle }),
};

const StationOps = {
  add: (station) => mongoOps.insertOne("stations", station),
  getByStationId: (station_id) => mongoOps.findMany("stations", { station_id }),
  getByAddress: (address) => mongoOps.findMany("stations", { address }),
  addTransaction: (station) => mongoOps.insertOne("stations", station),
  addTransactions: (stations) => mongoOps.insertMany("stations", stations),
  getTransactionByTxid: (txid) => mongoOps.findOne("stations", { txid }),
  getAll: (limit) => mongoOps.findMany("stations", {}, { limit }),
  deleteByStationId: (station_id) =>
    mongoOps.deleteMany("stations", { station_id }),
  deleteAll: () => mongoOps.deleteMany("stations"),
  getByStationIdLimit: (station_id, limit) =>
    mongoOps.findMany("stations", { station_id }, { limit }),
};

const HashOps = {
  add: (hash) => mongoOps.insertOne("hashes", hash),
  getByHash: (hash) => mongoOps.findOne("hashes", { hash }),
  getByEmail: (email) => mongoOps.findMany("hashes", { email }),
  getByUUID: (uuid) => mongoOps.findOne("hashes", { uuid }),
  getByTxid: (txid) => mongoOps.findOne("hashes", { txid }),
  addMultiple: (hashes) => mongoOps.insertMany("hashes", hashes),
};

const UTXOOps = {
  store: (utxo) =>
    mongoOps.updateOne(
      "utxos2",
      { txid: utxo.txid, vout: utxo.vout },
      { $set: utxo },
      { upsert: true }
    ),
  get: (utxo) => mongoOps.findOne("utxos", utxo),
  update: (utxo, details) =>
    mongoOps.updateOne("utxos", utxo, { $set: details }),
  delete: (utxo) => mongoOps.deleteOne("utxos", utxo),
  getAmount: (amount) => mongoOps.findMany("utxos", {}, { limit: amount }),
  storeMultiple: (utxos) => mongoOps.insertMany("utxos", utxos),
  getByAddress: (address) => mongoOps.findMany("utxos", { address }),
  getAmountByAddress: (address, amount) =>
    mongoOps.findMany("utxos", { address }, { limit: amount }),
};

const showAllStations = async () => {
  const stations = await StationOps.getAll();
  console.log(`Total stations: ${stations.length}`);
  console.log(stations);
};

export {
  TransactionOps,
  OTPOps,
  MemberOps,
  StationOps,
  HashOps,
  UTXOOps,
  mongoOps,
  showAllStations,
};
