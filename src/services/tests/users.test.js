const { UsersService } = require('..');
const { User } = require('../../models');
const { UserStatuses } = require('../../models');
const { UserRoles } = require('../../models');

jest.mock('../../models', () => ({
  User: class User {
    constructor () {
      this.name = 'Name';
      this.middleName = 'middlename';
      this.surname = 'surname';
      this.email = 'email@gmail.com';
      this.password = 'somepassword';
      this.phoneNumber = '0897123456';
      this.address = 'address 10';
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
        }),
        countDocuments: () => ({
          exec: () => 1
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
          _id: '12ad172xa9e',
          name: 'name4',
          middleName: 'middlename4',
          surname: 'surname4',
          email: 'email4@gmail.com',
          password: 'somepassword',
          phoneNumber: '0897133456',
          address: 'address 15',
          status: '52ad122xa7z'
        })
      };
    }
  },
  UserRoles: class UserRoles {
    static findOne () {
      return {
        exec: () => ({
          _id: '12ad122xa7b',
          name: 'User'
        })
      };
    }
  },
  UserStatuses: class UserStatuses {
    static findOne () {
      return {
        exec: () => ({
          _id: '12ad122xa7z',
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
    User.findOne = () => null;
    UserRoles.findOne = () => {
      return {
        exec: () => ({
          _id: '12ad122xa7b',
          name: 'User'
        })
      };
    };
    const response = await usersService.createUser(requestStub, responseStub);

    expect(response).toEqual(true);
  });

  it('should return all users', async () => {
    const response = await usersService.getUsers(requestStub, responseStub);

    expect(response).toEqual({
      total_size: 1,
      list: {
        id: '12ad122xa7e',
        name: 'Nameabc',
        middleName: 'middlename',
        surname: 'surname',
        email: 'email@gmail.com',
        phoneNumber: '0897123456',
        address: 'address 10'
      }
    });
  });

  it('should update user', async () => {
    User.findOne = () => {
      return {
        exec: () => ({
          _id: '12ad172xa9e',
          name: 'name4',
          middleName: 'middlename4',
          surname: 'surname4',
          email: 'email4@gmail.com',
          password: 'somepassword',
          phoneNumber: '0897133456',
          address: 'address 15',
          status: '12ad122xa7z'
        })
      };
    };
    const response = await usersService.updateUser(requestStub, responseStub);

    expect(response).toEqual(true);
  });

  /* it('should update password', async () => {
    const response = await usersService.updateUserPassword(
      requestStub,
      responseStub
    );

    expect(response).toEqual(true);
  }); */

  it('should create admin', async () => {
    User.findOne = () => null;
    UserRoles.findOne = () => {
      return {
        exec: () => ({
          _id: '12ad122xa7k',
          name: 'Admin'
        })
      };
    };
    const response = await usersService.createAdmin(requestStub, responseStub);

    expect(response).toEqual(true);
  });

  it('should block user', async () => {
    User.findOne = () => {
      return {
        exec: () => ({
          _id: '12ad172xa9e',
          name: 'name4',
          middleName: 'middlename4',
          surname: 'surname4',
          email: 'email4@gmail.com',
          password: 'somepassword',
          phoneNumber: '0897133456',
          address: 'address 15',
          status: '52ad122xa7z'
        })
      };
    };
    UserStatuses.findOne = () => {
      return {
        exec: () => ({
          _id: '12ad122xa7w',
          name: 'Blocked'
        })
      };
    };
    const response = await usersService.blockUser(requestStub, responseStub);

    expect(response).toEqual(true);
  });

  it('should delete user', async () => {
    User.findOne = () => {
      return {
        exec: () => ({
          _id: '12ad172xa9e',
          name: 'name4',
          middleName: 'middlename4',
          surname: 'surname4',
          email: 'email4@gmail.com',
          password: 'somepassword',
          phoneNumber: '0897133456',
          address: 'address 15',
          status: '52ad122xa7z'
        })
      };
    };
    UserStatuses.findOne = () => {
      return {
        exec: () => ({
          _id: '12ad122xa7q',
          name: 'Deleted'
        })
      };
    };
    const response = await usersService.deleteUser(requestStub, responseStub);

    expect(response).toEqual(true);
  });
});
