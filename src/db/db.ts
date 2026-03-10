import { Db, MongoClient } from 'mongodb';

import { SETTINGS } from '../core/settings/settings';
import * as mongoose from 'mongoose';

export const USERS_COLLECTION_NAME = 'users';

let client: MongoClient;

// let userCollection: Collection<User>;

export async function runDB(url: string): Promise<void> {
  client = new MongoClient(url);
  const db: Db = client.db(SETTINGS.DB_NAME);

  // userCollection = db.collection<User>(USERS_COLLECTION_NAME);

  // await ensureTTLIndex();
  // await ensureDevicesTTLIndex();
  // await postLikeCollection.dropIndex("userId_1_commentId_1")

  try {
    await client.connect();
    await db.command({ ping: 1 });
    console.log('✅ Connected to the database');
    await mongoose.connect(url);
    console.log('✅ Connected to the mongoose');
  } catch (e) {
    await client.close();
    await mongoose.disconnect();
    throw new Error(`❌ Database not connected: ${e}`);
  }
}
