const app = require('../../index');
const request = require('supertest');

jest.mock('../../models', () => ({
  ReplyComments: class ReplyComments {
    save () {
      return true;
    }

    static findByIdAndUpdate () {
      return {
        exec: () => true
      };
    }

    static findById () {
      return {
        exec: () => ({
          _id: '6335bbbf6d1e4900eff990af',
          userId: '06335760adbe069d28c1ed8bd',
          comment: 'comment 2'
        })
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
  Comments: class Comments {
    save () {
      return true;
    }

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
  Product: class Product {
    static findById () {
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

describe('Reply Comments integration tests', function () {
  it('should return reply comment by comment id', async () => {
    const response = await request(app).get(
      '/replyComments/?commentId=123sadf'
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ id: '13ad122xa2ae', name: 'Name' });
  });

  it('should create reply comment', async () => {
    const response = await request(app)
      .post('/replyComments')
      .set('authorization', 'Bearer abc123')
      .send({
        comment: 'comment',
        commentId: '12354fiajs12345asdsd1234'
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(true);
  });

  it('should update reply comment', async () => {
    const response = await request(app)
      .put('/replyComments/13ad122xa2ae')
      .set('authorization', 'Bearer abc123')
      .send({
        comment: 'comment'
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(true);
  });

  it('should delete reply comment', async () => {
    const response = await request(app)
      .delete('/replyComments/13ad122xa2ae')
      .set('authorization', 'Bearer abc123');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(true);
  });
});
