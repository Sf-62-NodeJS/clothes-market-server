const app = require('../../index');
const request = require('supertest');

jest.mock('../../models', () => ({
  Product: class Product {
    static findById () {
      return {
        exec: () => ({
          id: '15ad122xa3e',
          name: 'N',
          sizes: [],
          comments: []
        })
      };
    }

    save () {
      return {
        id: '16ad122xa2ae',
        name: 'Name',
        sizes: [],
        comments: []
      };
    }

    static find () {
      return {
        exec: () => ({
          id: '17ad122xa3e',
          name: 'N',
          sizes: [],
          comments: []
        })
      };
    }

    static findByIdAndUpdate () {
      return {
        exec: () => ({
          id: '18ad122xa3e',
          name: 'A',
          sizes: [],
          comments: []
        })
      };
    }

    static findByIdAndDelete () {
      return {
        exec: () => ({
          id: '19ad122xa3e',
          name: 'A',
          sizes: [],
          comments: []
        })
      };
    }
  }
}));

jest.mock('mongoose', () => ({
  connect: () => {}
}));

describe('Products integration tests', function () {
  it('should return product by id', async () => {
    const response = await request(app).get('/products/15ad122xa3e');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      id: '15ad122xa3e',
      name: 'N',
      sizes: [],
      comments: []
    });
  });

  it('should create product', async () => {
    const response = await request(app)
      .post('/products')
      .send({ name: 'Name' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      id: '16ad122xa2ae',
      name: 'Name',
      sizes: [],
      comments: []
    });
  });

  it('should return all products', async () => {
    const response = await request(app).get('/products/');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      id: '17ad122xa3e',
      name: 'N',
      sizes: [],
      comments: []
    });
  });

  it('should return updated product by id', async () => {
    const response = await request(app)
      .put('/products/18ad122xa3e')
      .send({ name: 'A' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      id: '18ad122xa3e',
      name: 'A',
      sizes: [],
      comments: []
    });
  });

  it('should return deleted product by id', async () => {
    const response = await request(app).delete('/products/14ad122xa3e');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      id: '19ad122xa3e',
      name: 'A',
      sizes: [],
      comments: []
    });
  });
});
