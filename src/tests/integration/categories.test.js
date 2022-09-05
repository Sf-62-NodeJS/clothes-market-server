const app = require('../../index');
const request = require('supertest');

jest.mock('../../models', () => ({
  Categories: class Categories {
    save () {
      return {
        id: '13ad122xa2ae',
        name: 'Name'
      };
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
    expect(response.body).toEqual({ id: '13ad122xa2ae', name: 'Name' });
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
