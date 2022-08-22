const { database, up } = require('migrate-mongo');

module.exports = async function migrationUp () {
  const { db, client } = await database.connect();
  await up(db, client);
};
