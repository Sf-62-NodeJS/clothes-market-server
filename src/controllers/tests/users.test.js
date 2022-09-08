const UsersController = require('../users');
const { User } = require('../../models');
const { UserStatuses } = require('../../models');
// const { UserRoles } = require('../../models');

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

describe('usersController tests', () => {
  const usersController = new UsersController();
  const requestStub = {
    body: {
      name: 'Name'
    },
    params: {
      id: '12ad122xa3e'
    },
    query: {
      _id: '32423rsf3xv',
      name: 'name',
      email: 'email@gmail.com',
      status: '341taffjafa',
      role: '4214asfcxgaa',
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

  /* it('should return created user', async () => {
    User.findOne = () => null;
    UserRoles.findOne = () => {
      return {
        exec: () => ({
          _id: '12ad122xa7b',
          name: 'User'
        })
      };
    };
    const user = await usersController.createUser(requestStub, responseStub);

    expect(user).toEqual(true);
  }); */

  it('should return all users', async () => {
    const users = await usersController.getUsers(requestStub, responseStub);

    expect(users).toEqual({
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
    const updatedUser = await usersController.updateUser(
      requestStub,
      responseStub
    );

    expect(updatedUser).toEqual(true);
  });

  /* it('should create admin', async () => {
    User.findOne = () => null;
    UserRoles.findOne = () => {
      return {
        exec: () => ({
          _id: '12ad122xa7k',
          name: 'Admin'
        })
      };
    };
    const user = await usersController.createAdmin(requestStub, responseStub);

    expect(user).toEqual(true);
  }); */

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
    const user = await usersController.blockUser(requestStub, responseStub);

    expect(user).toEqual(true);
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
    const user = await usersController.deleteUser(requestStub, responseStub);

    expect(user).toEqual(true);
  });
});
