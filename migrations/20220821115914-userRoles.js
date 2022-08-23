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
      console.error('Error with UserRoles Migration: ', error);
    }
  },

  async down (db) {
    try {
      await db.collection('userroles').deleteMany({});
    } catch (error) {
      console.error('Error with UserRoles Migration: ', error);
    }
  }
};
