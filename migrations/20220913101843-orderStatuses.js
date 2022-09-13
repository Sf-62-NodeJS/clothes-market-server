module.exports = {
  async up (db) {
    try {
      await db.collection('orderstatuses').deleteMany({});
      await db
        .collection('orderstatuses')
        .insertMany([
          { name: 'In progress' },
          { name: 'Resolved' },
          { name: 'Rejected' }
        ]);
    } catch (error) {
      console.error('Error with OrderStatuses Migration: ', error);
    }
  },

  async down (db) {
    try {
      await db.collection('orderstatuses').deleteMany({});
    } catch (error) {
      console.error('Error with OrderStatuses Migration: ', error);
    }
  }
};
