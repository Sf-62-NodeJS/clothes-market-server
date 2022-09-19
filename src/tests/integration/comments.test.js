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
  }
}));

jest.mock('mongoose', () => ({
  connect: () => {}
}));

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
