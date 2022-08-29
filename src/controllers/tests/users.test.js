const UsersController = require('../users');

jest.mock('../../models', () => ({
  User: class User {
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

    static findByIdAndDelete () {
      return {
        exec: () => ({
          id: '12ad122xa5e',
          name: 'Name2',
          middleName: 'middlenameeqwe',
          surname: 'surnamewerwer',
          email: 'email2@gmail.com',
          password: 'dasadasdasfdsad',
          phoneNumber: '0897183456',
          address: 'address 15'
        })
      };
    }

    static find () {
      return {
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
  }
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

    expect(user).toEqual({
      id: '13ad122xa2ae',
      name: 'Name',
      middleName: 'middlename',
      surname: 'surname',
      email: 'email@gmail.com',
      password: 'dasasdasfdsad',
      phoneNumber: '0897123456',
      address: 'address 10'
    });
  });

  it('should delete user', async () => {
    const deletedUser = await usersController.deleteUser(
      requestStub,
      responseStub
    );

    expect(deletedUser).toEqual(true);
  });

  it('should return all users', async () => {
    const users = await usersController.getUsers(requestStub, responseStub);

    expect(users).toEqual({
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
    const updatedUser = await usersController.updateUser(
      requestStub,
      responseStub
    );

    expect(updatedUser).toEqual(true);
  });
});
