const UsersController = require('../users');

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
        address: 'address 10'
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
          password: 'dasasasdasfdsad',
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
          id: '12ad122xa7z',
          name: 'Active'
        })
      };
    }
  }
}));

jest.mock('bcryptjs', () => ({
  ...jest.requireActual('bcryptjs'),
  compare: () => {}
}));

describe('usersController tests', () => {
  const usersController = new UsersController();
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

  it('should return created user', async () => {
    const user = await usersController.createUser(requestStub, responseStub);

    expect(user).toEqual(true);
  });

  it('should return all users', async () => {
    const users = await usersController.getUsers(requestStub, responseStub);

    expect(users).toEqual({
      id: '12ad122xa7e',
      name: 'Nameabc',
      middleName: 'middlename',
      surname: 'surname',
      email: 'email@gmail.com',
      phoneNumber: '0897123456',
      address: 'address 10'
    });
  });

  it('should update user', async () => {
    const updatedUser = await usersController.updateUser(
      requestStub,
      responseStub
    );

    expect(updatedUser).toEqual(true);
  });

  it('should update password', async () => {
    const updatedUser = await usersController.updateUserPassword(
      requestStub,
      responseStub
    );

    expect(updatedUser).toEqual(true);
  });

  it('should create admin', async () => {
    const user = await usersController.createAdmin(requestStub, responseStub);

    expect(user).toEqual(true);
  });

  it('should block user', async () => {
    const user = await usersController.blockUser(requestStub, responseStub);

    expect(user).toEqual(true);
  });

  it('should delete user', async () => {
    const user = await usersController.deleteUser(requestStub, responseStub);

    expect(user).toEqual(true);
  });
});
