const app = require('../../index');
const request = require('supertest');

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

jest.mock('mongoose', () => ({
  connect: () => {}
}));

describe('Users integration tests', function () {
  it('should create user', async () => {
    const response = await request(app).post('/users').send({
      name: 'Name',
      middleName: 'middlename',
      surname: 'surname',
      email: 'email@gmail.com',
      password: 'dasasdasfdsad',
      phoneNumber: '0897123456',
      address: 'address 10'
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
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
    const response = await request(app).delete('/users/12ad122xa5e');

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
      password: 'dasasdasfdsad',
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

  it('should return all users 2', async () => {
    const response = await request(app).get(
      '/users/?name=Gosho&email=pesho@gmail.com&status=active&role=user&_id=14324234sdfgs'
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
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
});
