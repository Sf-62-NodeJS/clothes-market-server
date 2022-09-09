const app = require('../../index');
const request = require('supertest');
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
        id: '12ad172xa9e',
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

jest.mock('mongoose', () => ({
  connect: () => {}
}));

jest.mock('bcryptjs', () => ({
  ...jest.requireActual('bcryptjs'),
  compare: () => true
}));

describe('Users integration tests', function () {
  it('should create user if user is deleted', async () => {
    User.find = () => {
      return {
        exec: () => [
          {
            _id: '12ad122xa7babc',
            email: 'email123@gmail.com',
            status: '12ad122xa7b'
          }
        ]
      };
    };
    UserRoles.findOne = () => {
      return {
        exec: () => ({
          _id: '12ad122xa7b',
          name: 'User'
        })
      };
    };
    UserStatuses.find = () => {
      return {
        exec: () => [
          {
            _id: '12ad122xa7w',
            name: 'Active'
          },
          {
            _id: '12ad122xa7b',
            name: 'Deleted'
          }
        ]
      };
    };
    const response = await request(app).post('/users').send({
      name: 'Name',
      middleName: 'middlename',
      surname: 'surname',
      email: 'email5@gmail.com',
      password: 'dasasdasfdsad',
      phoneNumber: '0897123456',
      address: 'address 10'
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(true);
  });

  it('should create user', async () => {
    User.find = () => {
      return {
        exec: () => []
      };
    };
    UserRoles.findOne = () => {
      return {
        exec: () => ({
          _id: '12ad122xa7b',
          name: 'User'
        })
      };
    };
    UserStatuses.find = () => {
      return {
        exec: () => [
          {
            _id: '12ad122xa7w',
            name: 'Active'
          },
          {
            _id: '12ad122xa7b',
            name: 'Deleted'
          }
        ]
      };
    };
    const response = await request(app).post('/users').send({
      name: 'Name',
      middleName: 'middlename',
      surname: 'surname',
      email: 'email5@gmail.com',
      password: 'dasasdasfdsad',
      phoneNumber: '0897123456',
      address: 'address 10'
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(true);
  });

  it('should return all users', async () => {
    User.find = () => {
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
    };
    const response = await request(app).get('/users/');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      id: '12ad122xa7e',
      name: 'Nameabc',
      middleName: 'middlename',
      surname: 'surname',
      email: 'email@gmail.com',
      phoneNumber: '0897123456',
      address: 'address 10'
    });
  });

  it('should return all users with query params', async () => {
    User.find = () => {
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
    };
    const response = await request(app).get(
      '/users/?_id=234235sfsfeq234&name=Name&email=email@yahoo.com&status=214sf43524d&role=234segf53452&skip=1&take=50'
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
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
    const response = await request(app)
      .put('/users/12ad122xa9e')
      .send({ name: 'Gosho' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(true);
  });

  it('should update user password', async () => {
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
    User.findOneAndUpdate = () => {
      return {
        _id: '12ad172xa9e',
        name: 'name4',
        middleName: 'middlename4',
        surname: 'surname4',
        email: 'email4@gmail.com',
        password: 'dasasdasfdsad',
        phoneNumber: '0897133456',
        address: 'address 15',
        status: '12ad122xa7z'
      };
    };
    const response = await request(app)
      .patch('/users/password/12ad172xa9e')
      .send({ oldPassword: 'somepassword', newPassword: 'dasasdasfdsad' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(true);
  });

  it('should create admin', async () => {
    User.find = () => {
      return {
        exec: () => []
      };
    };
    UserRoles.findOne = () => {
      return {
        exec: () => ({
          _id: '12ad122xa7k',
          name: 'Admin'
        })
      };
    };
    UserStatuses.find = () => {
      return {
        exec: () => [
          {
            _id: '12ad122xa7w',
            name: 'Active'
          },
          {
            _id: '12ad122xa7b',
            name: 'Deleted'
          }
        ]
      };
    };
    const response = await request(app).post('/users/admin').send({
      name: 'Name',
      middleName: 'middlename',
      surname: 'surname',
      email: 'email@gmail.com',
      password: 'dasasdasfdsad',
      phoneNumber: '0897123456',
      address: 'address 10'
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(true);
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
    UserStatuses.find = () => {
      return {
        exec: () => [
          {
            _id: '12ad122xa7w',
            name: 'Blocked'
          },
          {
            _id: '12ad122xa7b',
            name: 'Deleted'
          }
        ]
      };
    };
    const response = await request(app).patch('/users/block/12ad122xa9e');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(true);
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
    const response = await request(app).patch('/users/delete/12ad122xa9e');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(true);
  });
});
