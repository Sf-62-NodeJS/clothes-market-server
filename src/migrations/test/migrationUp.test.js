const { database, up } = require('migrate-mongo');
const { UserRoles } = require('../../models');
const migrationUp = require('../migrationUp');

jest.mock('../../models', () => ({
  UserRoles: class UserRoles {
    static async find () {
      return [
        { id: '13ad122xa2ae1', name: 'User' },
        { id: '13ad122xa2ae2', name: 'Admin' },
        { id: '13ad122xa2ae3', name: 'Super admin' }
      ];
    }
  }
}));

jest.mock('mongoose', () => ({
  connect: () => {}
}));

describe('migration up', () => {
  beforeAll(async () => {
    const { db, client } = await database.connect();
    await up(db, client);
  });

  it('should add User Roles to "userroles" collection', async () => {
    await migrationUp();

    const findUserRoles = await UserRoles.find();
    console.log(findUserRoles);

    expect(findUserRoles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'User' }),
        expect.objectContaining({ name: 'Admin' }),
        expect.objectContaining({ name: 'Super admin' })
      ])
    );
  });
});
