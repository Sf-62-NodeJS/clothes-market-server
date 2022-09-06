const { UsersService } = require('..');

jest.mock('../../models', () => ({
  User: class User {
    constructor () {
      this.password = 'somepassword';
    }

    save () {
      return {
        id: '13ad122xa2ae',
        name: 'Name',
        middleName: 'middlename',
        surname: 'surname',
        email: 'email@gmail.com',
        password: 'dasasdasfdsad',
        phoneNumber: '0897123456',
        address: 'address 10',
        role: '630f3ec97063d679867e502d',
        status: '630f3eca7063d679867e502e'
      };
    }

    static find () {
      return {
        select: () => ({
          skip: () => ({
            limit: () => ({
              exec: () => ({
                id: '12ad122xa7e',
                name: 'Nameabc',
                middleName: 'middlename',
                surname: 'surname',
                email: 'email@gmail.com',
                password: 'dasasdasfdsad',
                phoneNumber: '0897123456',
                address: 'address 10'
              })
            })
          })
        })
      };
    }

    static findByIdAndUpdate () {
      return {
        exec: () => ({
          id: '12ad122xa9e',
          name: 'Gosho',
          middleName: 'middlename',
          surname: 'surname',
          email: 'email@gmail.com',
          password: 'dasasdasfdsad',
          phoneNumber: '0897123456',
          address: 'address 10'
        })
      };
    }

    static findOne () {
      return {
        exec: () => ({
          id: '12ad172xa9e',
          name: 'name4',
          middleName: 'middlename4',
          surname: 'surname4',
          email: 'email4@gmail.com',
          password: 'somepassword',
          phoneNumber: '0897133456',
          address: 'address 15'
        })
      };
    }
  },
  UserRoles: class UserRoles {
    static findOne () {
      return {
        exec: () => ({
          id: '12ad122xa7b',
          name: 'User'
        })
      };
    }
  },
  UserStatuses: class UserStatuses {
    static findOne () {
      return {
        exec: () => ({
          id: '12ad122xa7b',
          name: 'Active'
        })
      };
    }
  }
}));

jest.mock('bcryptjs', () => ({
  ...jest.requireActual('bcryptjs'),
  compare: () => true
}));

describe('Users service tests', function () {
  const usersService = new UsersService();
  const requestStub = {
    body: {
      name: 'Name',
      middleName: 'middlename',
      surname: 'surname',
      email: 'email@gmail.com',
      password: 'somepassword',
      phoneNumber: '0897123456',
      address: 'address 10'
    },
    params: {
      id: '15ad122xa3e'
    },
    query: {
      skip: 1,
      take: 1
    }
  };

  const responseStub = {
    boom: {
      badRequest: jest.fn()
    },
    json: (payload) => payload
  };

  it('should create user', async () => {
    const response = await usersService.createUser(requestStub, responseStub);

    expect(response).toEqual(true);
  });

  it('should return all users', async () => {
    const response = await usersService.getUsers(requestStub, responseStub);

    expect(response).toEqual({
      id: '12ad122xa7e',
      name: 'Nameabc',
      middleName: 'middlename',
      surname: 'surname',
      email: 'email@gmail.com',
      password: 'dasasdasfdsad',
      phoneNumber: '0897123456',
      address: 'address 10'
    });
  });

  it('should update user', async () => {
    const response = await usersService.updateUser(requestStub, responseStub);

    expect(response).toEqual(true);
  });

  it('should update password', async () => {
    const response = await usersService.updateUserPassword(
      requestStub,
      responseStub
    );

    expect(response).toEqual(true);
  });

  it('should create admin', async () => {
    const response = await usersService.createAdmin(requestStub, responseStub);

    expect(response).toEqual(true);
  });

  it('should block user', async () => {
    const response = await usersService.blockUser(requestStub, responseStub);

    expect(response).toEqual(true);
  });

  it('should delete user', async () => {
    const response = await usersService.deleteUser(requestStub, responseStub);

    expect(response).toEqual(true);
  });
});
