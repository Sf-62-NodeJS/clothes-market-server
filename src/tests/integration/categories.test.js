const app = require('../../index');
const request = require('supertest');

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
  },
  Product: class Product {
    static find () {
      return { exec: () => false };
    }
  },
  UserRoles: class UserRoles {
    static find () {
      return { exec: () => [{ _id: 'Admin' }] };
    }
  }
}));

jest.mock('mongoose', () => ({
  connect: () => {}
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

describe('Categories integration tests', function () {
  it('should return category by id', async () => {
    const response = await request(app).get('/categories/?name=name');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ id: '13ad122xa2ae', name: 'Name' });
  });

  it('should create category', async () => {
    const response = await request(app)
      .post('/categories')
      .send({ name: 'Name' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(true);
  });

  it('should update category', async () => {
    const response = await request(app).put('/categories/13ad122xa2ae').send({
      name: 'Name'
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(true);
  });

  it('should delete category', async () => {
    const response = await request(app).delete('/categories/13ad122xa2ae');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(true);
  });
});
