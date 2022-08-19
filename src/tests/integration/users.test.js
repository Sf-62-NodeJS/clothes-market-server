const app = require('../../index');
const request = require('supertest');

jest.mock('../../models', () => ({
  User: class User {
    static findById () {
      return { exec: () => ({ id: '12ad122xa3e', name: 'N' }) };
    }

    save () {
      return { id: '13ad122xa2ae', name: 'Name' };
    }

    static deleteUser () {
      return { exec: () => ({ id: '12ad122xa5e', name: 'Name' }) };
    }

    static getUsers () {
      return { exec: () => ({ id: '12ad122xa7e', name: 'Nameabc' }) };
    }

    static updateUser () {
      return { exec: () => ({ id: '12ad122xa9e', name: 'Nameabcdefg' }) };
    }

    static blockUser () {
      return {
        exec: () => ({ id: '12ad122xa4e', name: 'Nameabcdefgasd' })
      };
    }
  }
}));

jest.mock('mongoose', () => ({
  connect: () => {}
}));

describe('Users integration tests', function () {
  it('should return user by id', async () => {
    const response = await request(app).get('/users/12ad122xa3e');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ id: '12ad122xa3e', name: 'N' });
  });

  it('should create user', async () => {
    const response = await request(app)
      .post('/users')
      .send({ name: 'Name' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ id: '13ad122xa2ae', name: 'Name' });
  });

  it('should delete user', async () => {
    const response = await request(app).delete('/delete/12ad122xa5e');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: 'User is deleted.' });
  });

  it('should return all users', async () => {
    const response = await request(app).post('/users/all_users');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ id: '12ad122xa7e', name: 'Nameabc' });
  });

  it('should update user', async () => {
    const response = await request(app)
      .patch('/users/update/12ad122xa9e')
      .send({ name: 'Gosho' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ id: '12ad122xa9e', name: 'Gosho' });
  });

  it('should block user', async () => {
    const response = await request(app)
      .patch('/users/12ad122xa4e')
      .send({ status: 'blocked' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ id: '12ad122xa4e', status: 'blocked' });
  });
});
