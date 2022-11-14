import Dexie from 'dexie';

export const db = new Dexie('variantes');
db.version(1).stores({
  friends: '++id, data', // Primary key and indexed props
});
