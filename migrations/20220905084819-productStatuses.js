module.exports = {
  async up (db) {
    try {
      await db.collection('productstatuses').deleteMany({});
      await db
        .collection('productstatuses')
        .insertMany([{ name: 'Available' }, { name: 'Not available' }]);
    } catch (error) {
      console.error('Error with ProductStatuses Migration: ', error);
    }
  },

  async down (db) {
    try {
      await db.collection('productstatuses').deleteMany({});
    } catch (error) {
      console.error('Error with ProductStatuses Migration: ', error);
    }
  }
};
