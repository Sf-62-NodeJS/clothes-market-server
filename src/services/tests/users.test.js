const { UsersService } = require('..');

jest.mock('../../models', () => ({
  User: class User {
    static findById () {
      return { exec: () => ({ id: '12ad122xa3e', name: 'N' }) };
    }

    save () {
      return { id: '13ad122xa2ae', name: 'Name' };
    }
  }
}));

describe('usersService tests', () => {
  const usersService = new UsersService();
  const requestStub = {
    body: {
      name: 'Name'
    },
    params: {
      id: '12ad122xa3e'
    }
  };

  const responseStub = {
    boom: {
      badRequest: jest.fn()
    },
    json: (payload) => payload
  };

  it('should return user', async () => {
    const user = await usersService.getUser(requestStub, responseStub);

    expect(user).toEqual({ id: '12ad122xa3e', name: 'N' });
  });

  it('should return created user', async () => {
    const user = await usersService.createUser(requestStub, responseStub);

    expect(user).toEqual({ id: '13ad122xa2ae', name: 'Name' });
  });
});
