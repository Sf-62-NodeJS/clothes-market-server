const app = require('../../index');
const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../../models', () => ({
  Categories: class Categories {
    save () {
      return true;
    }

    static findByIdAndUpdate () {
      return {
        exec: () => true
      };
    }

    static findOne () {
      return {
        exec: () => null
      };
    }

    static find () {
      return {
        exec: () => ({
          id: '13ad122xa2ae',
          name: 'Name'
        }),
        count: () => 1
      };
    }

    static findByIdAndDelete () {
      return {
        exec: () => true
      };
    }
  }
}));

jest.mock('mongoose', () => ({
  connect: () => {}
}));

jest.mock('jsonwebtoken');

describe('Categories integration tests', function () {
  beforeEach(() => {
    jwt.verify = jest.fn().mockImplementationOnce((token, secret, cb) => {
      cb(null, { role: 'Admin' });
    });
  });

  it('should return category by id', async () => {
    const response = await request(app).get('/categories/?name=name');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ id: '13ad122xa2ae', name: 'Name' });
  });

  it('should create category', async () => {
    const response = await request(app)
      .post('/categories')
      .set('authorization', 'Bearer abc123')
      .send({ name: 'Name' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(true);
  });

  it('should update category', async () => {
    const response = await request(app)
      .put('/categories/13ad122xa2ae')
      .set('authorization', 'Bearer abc123')
      .send({
        name: 'Name'
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(true);
  });

  it('should delete category', async () => {
    const response = await request(app)
      .delete('/categories/13ad122xa2ae')
      .set('authorization', 'Bearer abc123');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(true);
  });
});
