import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { SavedPost } from '../types';

/**
 * Note: The user requested "sqlite3" or "better-sqlite3".
 * These are Node.js specific libraries that require native C++ bindings and filesystem access.
 * They DO NOT work in a browser environment (React/Vite).
 * 
 * As a robust, world-class frontend solution, we are using IndexedDB (via 'idb').
 * This is the browser-native equivalent of a local SQL database for storing structured data.
 */

interface DailyRiffDB extends DBSchema {
  posts: {
    key: string;
    value: SavedPost;
    indexes: { 'by-date': number };
  };
}

const DB_NAME = 'daily-riff-db';
const STORE_NAME = 'posts';

let dbPromise: Promise<IDBPDatabase<DailyRiffDB>> | null = null;

const getDB = () => {
  if (!dbPromise) {
    dbPromise = openDB<DailyRiffDB>(DB_NAME, 1, {
      upgrade(db) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('by-date', 'createdAt');
      },
    });
  }
  return dbPromise;
};

export const savePostLocally = async (post: Omit<SavedPost, 'id' | 'createdAt'>): Promise<void> => {
  const db = await getDB();
  const newPost: SavedPost = {
    ...post,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  await db.put(STORE_NAME, newPost);
};

export const getSavedPosts = async (): Promise<SavedPost[]> => {
  const db = await getDB();
  return db.getAllFromIndex(STORE_NAME, 'by-date');
};

export const deleteSavedPost = async (id: string): Promise<void> => {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
};
