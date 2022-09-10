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
  }
}));

jest.mock('mongoose', () => ({
  connect: () => {}
}));

describe('Reply Comments integration tests', function () {
  it('should return reply comment by comment id', async () => {
    const response = await request(app).get(
      '/replyComments/?commentId=123sadf'
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ id: '13ad122xa2ae', name: 'Name' });
  });

  it('should create reply comment', async () => {
    const response = await request(app).post('/replyComments').send({
      comment: 'comment',
      commentId: '12354fiajs12345asdsd1234'
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(true);
  });

  it('should update reply comment', async () => {
    const response = await request(app)
      .put('/replyComments/13ad122xa2ae')
      .send({
        comment: 'comment'
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(true);
  });

  it('should delete reply comment', async () => {
    const response = await request(app).delete('/replyComments/13ad122xa2ae');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(true);
  });
});
