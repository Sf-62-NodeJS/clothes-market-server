const app = require('../../index');
const request = require('supertest');

jest.mock('../../models', () => ({
  Product: class Product {
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
        skip: () => ({
          limit: () => ({
            exec: () => ({
              id: '17ad122xa3e',
              name: 'N',
              imageUrl: 'https://www.com',
              category: '17cat122xa3e',
              sizes: ['17size122xa2ae', '17size222xa2ae'],
              status: '17stat122xa2ae',
              comments: ['17comm122xa2ae', '17comm222xa2ae'],
              price: 2.0
            })
          })
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
      imageUrl: 'https://www.com',
      category: '17cat122xa3e',
      sizes: ['17size122xa2ae', '17size222xa2ae'],
      status: '17stat122xa2ae',
      comments: ['17comm122xa2ae', '17comm222xa2ae'],
      price: 2.0
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
    const response = await request(app).delete('/products/19ad122xa3e');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      id: '19ad122xa3e',
      name: 'A',
      sizes: [],
      comments: []
    });
  });
});
