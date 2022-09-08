module.exports = {
  async up (db) {
    try {
      await db.collection('userstatuses').deleteMany({});
      await db
        .collection('userstatuses')
        .insertMany([
          { name: 'Active' },
          { name: 'Blocked' },
          { name: 'Deleted' }
        ]);
    } catch (error) {
      console.error('Error with UserStatuses Migration: ', error);
    }
  },

  async down (db) {
    try {
      await db.collection('userstatuses').deleteMany({});
    } catch (error) {
      console.error('Error with UserStatuses Migration: ', error);
    }
  }
};
