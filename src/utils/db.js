import Dexie from 'dexie';

const db = new Dexie('integrator-ui');

db.version(1).stores({
  pipelines: '++id',
});

export default db;
