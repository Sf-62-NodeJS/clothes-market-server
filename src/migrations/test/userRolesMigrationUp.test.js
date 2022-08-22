const mongoose = require('mongoose');
const { UserRoles } = require('../../models');
const dbMigrations = require('..');

describe('migration up', () => {
  beforeAll(async () => {
    mongoose.connect('mongodb://localhost/academy-project');
  });

  it('should remove all documents in "userroles" collection', async () => {
    await dbMigrations.up();
    const findUserRoles = await UserRoles.find();

    expect(findUserRoles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'User' }),
        expect.objectContaining({ name: 'Admin' }),
        expect.objectContaining({ name: 'Super admin' })
      ])
    );
  });
});
