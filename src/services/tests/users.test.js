const { UsersService } = require('..');

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

describe('Users service tests', function () {
  const usersService = new UsersService();
  const requestStub = {
    body: {
      name: 'Name'
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
    const response = await usersService.createUser(
      requestStub,
      responseStub
    );

    expect(response).toEqual({
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

  it('should return updated user', async () => {
    const response = await usersService.updateUser(
      requestStub,
      responseStub
    );

    expect(response).toEqual(true);
  });

  it('should return deleted user', async () => {
    const response = await usersService.deleteUser(
      requestStub,
      responseStub
    );

    expect(response).toEqual(true);
  });
});
