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
  }
}));

jest.mock('mongoose', () => ({
    connect: () => {}
}))

describe('Users integration tests', function () {
  it('should return user by id', async () => {
    const response = await request(app).get(
      '/users/12ad122xa3e'
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ id: '12ad122xa3e', name: 'N' });
  });

  it('should create user', async () => {
    const response = await request(app).post(
      '/users'
    ).send({ name: 'Name' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ id: '13ad122xa2ae', name: 'Name' });
  });
});
