const app = require('../../index');
const request = require('supertest');
const jwt = require('jsonwebtoken');

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
        count: () => 1,
        skip: () => ({
          limit: () => ({
            exec: () => ({
              id: '17ad122xa3e',
              name: 'N',
              image: 'img.png',
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

    static findById () {
      return {
        exec: () => ({ image: 'image.jpg' })
      };
    }

    static findByIdAndUpdate () {
      return {
        exec: () => true
      };
    }

    static findByIdAndDelete () {
      return {
        exec: () => true
      };
    }
  },
  ProductStatuses: class ProductStatuses {
    static findOne () {
      return { exec: () => ({ _id: '123asdasd' }) };
    }
  },
  Categories: class Categories {
    static findOne () {
      return { exec: () => ({ _id: '123asdasd' }) };
    }
  }
}));

jest.mock('mongoose', () => ({
  connect: () => {}
}));

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  unlink: jest.fn()
}));

jest.mock(
  'express-fileupload',
  () => () =>
    function (req, res, next) {
      req.files = {
        image: {
          mv: jest.fn()
        }
      };

      next();
    }
);

jest.mock('jsonwebtoken');

describe('Products integration tests', function () {
  it('should create product', async () => {
    jwt.verify = jest.fn().mockImplementationOnce((token, secret, cb) => {
      cb(null, { role: 'Admin' });
    });
    const response = await request(app)
      .post('/products')
      .set('authorization', 'Bearer abc123')
      .send({
        name: 'Name',
        description: 'Description',
        category: '123456789123456789123456',
        sizes: '123456789123456789123456',
        price: 2.0
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      id: '16ad122xa2ae',
      name: 'Name',
      sizes: [],
      comments: []
    });
  });

  it('should return all products', async () => {
    const response = await request(app).get('/products');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      id: '17ad122xa3e',
      name: 'N',
      image: 'img.png',
      category: '17cat122xa3e',
      sizes: ['17size122xa2ae', '17size222xa2ae'],
      status: '17stat122xa2ae',
      comments: ['17comm122xa2ae', '17comm222xa2ae'],
      price: 2.0
    });
  });

  it('should return all products within query', async () => {
    const response = await request(app).get(
      '/products/?_id=17ad122xa3e2323232332323&name=Name&category=17ad122xa3e2323232332323&sizes=17ad122xa3e2323232332323&status=17ad122xa3e2323232332323&minPrice=1&maxPrice=2'
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      id: '17ad122xa3e',
      name: 'N',
      image: 'img.png',
      category: '17cat122xa3e',
      sizes: ['17size122xa2ae', '17size222xa2ae'],
      status: '17stat122xa2ae',
      comments: ['17comm122xa2ae', '17comm222xa2ae'],
      price: 2.0
    });
  });

  it('should return all products with price above 2', async () => {
    const response = await request(app).get('/products/?minPrice=2');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      id: '17ad122xa3e',
      name: 'N',
      image: 'img.png',
      category: '17cat122xa3e',
      sizes: ['17size122xa2ae', '17size222xa2ae'],
      status: '17stat122xa2ae',
      comments: ['17comm122xa2ae', '17comm222xa2ae'],
      price: 2.0
    });
  });

  it('should return all products with price below 2', async () => {
    const response = await request(app).get('/products/?maxPrice=2');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      id: '17ad122xa3e',
      name: 'N',
      image: 'img.png',
      category: '17cat122xa3e',
      sizes: ['17size122xa2ae', '17size222xa2ae'],
      status: '17stat122xa2ae',
      comments: ['17comm122xa2ae', '17comm222xa2ae'],
      price: 2.0
    });
  });

  it('should return updated product by id', async () => {
    jwt.verify = jest.fn().mockImplementationOnce((token, secret, cb) => {
      cb(null, { role: 'Admin' });
    });
    const response = await request(app)
      .put('/products/18ad122xa3e')
      .set('authorization', 'Bearer abc123')
      .send({
        name: 'Name',
        description: 'Description',
        price: 2.0
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(true);
  });

  it('should return deleted product by id', async () => {
    jwt.verify = jest.fn().mockImplementationOnce((token, secret, cb) => {
      cb(null, { role: 'Admin' });
    });
    const response = await request(app)
      .delete('/products/19ad122xa3e')
      .set('authorization', 'Bearer abc123');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(true);
  });
});
