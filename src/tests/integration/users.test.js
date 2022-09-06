const app = require('../../index');
const request = require('supertest');

jest.mock('../../models', () => ({
  User: class User {
    constructor () {
      this.password = 'somepassword';
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
          id: '12ad122xa7z',
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
  it('should create user', async () => {
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

  it('should update user', async () => {
    const response = await request(app)
      .put('/users/12ad122xa9e')
      .send({ name: 'Gosho' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(true);
  });

  it('should update user password', async () => {
    const response = await request(app)
      .patch('/users/password/12ad172xa9e')
      .send({ oldPassword: 'somepassword', newPassword: 'dasasdasfdsad' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(true);
  });

  it('should create admin', async () => {
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
    const response = await request(app).patch('/users/block/12ad122xa9e');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(true);
  });

  it('should delete user', async () => {
    const response = await request(app).patch('/users/delete/12ad122xa9e');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(true);
  });
});
