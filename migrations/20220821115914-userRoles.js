module.exports = {
  async up (db) {
    try {
      await db.collection('userroles').deleteMany({});
      await db
        .collection('userroles')
        .insertMany([
          { name: 'User' },
          { name: 'Admin' },
          { name: 'Super admin' }
        ]);
    } catch (error) {
      console.log('Error with UserRoles Migration: ', error);
    }
  },

  async down (db) {
    await db.collection('userroles').deleteMany({});
  }
};
