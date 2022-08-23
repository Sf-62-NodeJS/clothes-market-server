const { database, up } = require('migrate-mongo');

async function migrationUp () {
  const { db, client } = await database.connect();
  await up(db, client);
}

module.exports = migrationUp;
