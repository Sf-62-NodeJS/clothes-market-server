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
        id: '632883492f58e39923fe1ac1',
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
                id: '632883492f58e39923fe1ac1',
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
          id: '632883492f58e39923fe1ac1',
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
          _id: '632883492f58e39923fe1ac1',
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

    static find () {
      return { exec: () => [{ _id: 'Admin' }] };
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

jest.mock('passport', () => ({
  use: jest.fn(),
  serializeUser: jest.fn(),
  deserializeUser: jest.fn(),
  authenticate: () => (req, res, next) => next(),
  session: () => (req, res, next) => next(),
  initialize: () => (req, res, next) => {
    req.session = {
      passport: {
        user: {
          role: 'Admin'
        }
      }
    };

    next();
  }
}));

jest.mock('passport-google-oauth2', () => ({
  Strategy: class GoogleStrategy {
    constructor (settings, verifyFunc) {
      this.settings = settings;
      this.verifyFunc = verifyFunc;
    }
  }
}));

jest.mock('passport-custom', () => ({
  Strategy: class CustomStrategy {
    constructor (verifyFunc) {
      this.verifyFunc = verifyFunc;
    }
  }
}));

jest.mock('express-session', () => () => (req, res, next) => next());

describe('Users integration tests', function () {
  it('should create user if user is deleted', async () => {
    User.find = () => {
      return {
        exec: () => [
          {
            _id: '632883492f58e39923fe1ac1',
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
                id: '632883492f58e39923fe1ac1',
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
      id: '632883492f58e39923fe1ac1',
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
                id: '632883492f58e39923fe1ac1',
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
      '/users/?_id=632883492f58e39923fe1ac1&email=email@gmail.com&status=630f51a601db34bca1f8b19f&role=630f51a601db34bca1f8b19f&skip=1&take=50'
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      id: '632883492f58e39923fe1ac1',
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
          _id: '632883492f58e39923fe1ac1',
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
      .put('/users/632883492f58e39923fe1ac1')
      .send({ name: 'Gosho' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(true);
  });

  it('should update user password', async () => {
    User.findOne = () => {
      return {
        exec: () => ({
          _id: '632883492f58e39923fe1ac1',
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
        exec: () => ({
          _id: '632883492f58e39923fe1ac1',
          name: 'name4',
          middleName: 'middlename4',
          surname: 'surname4',
          email: 'email4@gmail.com',
          password: 'dasasdasfdsad',
          phoneNumber: '0897133456',
          address: 'address 15',
          status: '12ad122xa7z'
        })
      };
    };
    const response = await request(app)
      .patch('/users/password/632883492f58e39923fe1ac1')
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
          _id: '632883492f58e39923fe1ac1',
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
    const response = await request(app).patch(
      '/users/block/632883492f58e39923fe1ac1'
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(true);
  });

  it('should delete user', async () => {
    User.findOne = () => {
      return {
        exec: () => ({
          _id: '632883492f58e39923fe1ac1',
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
    const response = await request(app).patch(
      '/users/delete/632883492f58e39923fe1ac1'
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(true);
  });
});
