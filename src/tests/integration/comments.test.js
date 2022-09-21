const app = require('../../index');
const request = require('supertest');

jest.mock('../../models', () => ({
  Comments: class Comments {
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
        exec: () => ({ _id: '123124125', replyComments: [{ id: '312312123' }] })
      };
    }
  },
  Product: class Product {
    static findById () {
      return {
        exec: () => true
      };
    }

    static findByIdAndUpdate () {
      return {
        exec: () => true
      };
    }

    static findOneAndUpdate () {
      return {
        exec: () => true
      };
    }

    static updateOne () {
      return {
        exec: () => true
      };
    }
  },
  ReplyComments: class ReplyComments {
    static deleteMany () {
      return {
        exec: () => true
      };
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

describe('Comments integration tests', function () {
  it('should return comments by product id', async () => {
    const response = await request(app).get('/comments/?productId=123sadf');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ id: '13ad122xa2ae', name: 'Name' });
  });

  it('should create comment', async () => {
    const response = await request(app)
      .post('/comments')
      .set('authorization', 'Bearer abc123')
      .send({
        comment: 'comment',
        productId: '12354fiajs12345asdsd1234'
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(true);
  });

  it('should update comment', async () => {
    const response = await request(app)
      .put('/comments/13ad122xa2ae')
      .set('authorization', 'Bearer abc123')
      .send({
        comment: 'comment'
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(true);
  });

  it('should delete comment', async () => {
    const response = await request(app)
      .delete('/comments/13ad122xa2ae')
      .set('authorization', 'Bearer abc123');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(true);
  });
});
