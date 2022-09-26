const app = require('../../index');
const request = require('supertest');
const { Orders } = require('../../models');

jest.mock('../../models', () => ({
  Orders: class Orders {
    save () {
      return {
        id: '632883492f58e39923fe1ac1',
        products: ['632883492f58e39923fe1ac4'],
        status: '632883492f58e39923fe1ac2'
      };
    }

    static find () {
      return {
        exec: () => ({
          id: '632883492f58e39923fe1ac1',
          products: ['632883492f58e39923fe1ac4'],
          status: '632883492f58e39923fe1ac2'
        }),
        countDocuments: () => ({
          exec: () => 1
        })
      };
    }

    static findByIdAndDelete () {
      return {
        exec: () => ({
          id: '632883492f58e39923fe1ac1',
          products: ['632883492f58e39923fe1ac4']
        })
      };
    }

    static findByIdAndUpdate () {
      return {
        exec: () => ({
          id: '632883492f58e39923fe1ac1',
          products: ['632883492f58e39923fe1ac5'],
          status: '632883492f58e39923fe1ac6'
        })
      };
    }

    static findOne () {
      return {
        exec: () => ({
          _id: '632883492f58e39923fe1ac1',
          products: ['632883492f58e39923fe1ac4'],
          status: '632883492f58e39923fe1ac2'
        })
      };
    }
  },

  OrderStatuses: class OrderStatuses {
    static findOne () {
      return {
        exec: () => ({
          _id: '632883492f58e39923fe1ac2',
          name: 'In progress'
        })
      };
    }

    static find () {
      return {
        exec: () => [
          {
            _id: '632883492f58e39923fe1ac2',
            name: 'In progress'
          },
          {
            _id: '632883492f58e39923fe1ac6',
            name: 'Resolved'
          },
          {
            _id: '632883492f58e39923fe1ac7',
            name: 'Rejected'
          }
        ]
      };
    }
  },

  Product: class Product {
    static find () {
      return {
        exec: () => [
          {
            _id: '632883492f58e39923fe1ac5'
          },
          {
            _id: '632883492f58e39923fe1ac6'
          },
          {
            _id: '632883492f58e39923fe1ac7'
          }
        ]
      };
    }
  }
}));

jest.mock('mongoose', () => ({
  connect: () => {}
}));

describe('Orders integration tests', function () {
  it('should create order', async () => {
    const response = await request(app)
      .post('/orders')
      .send({
        products: ['632883492f58e39923fe1ac4']
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(true);
  });

  it('should update order with add/delete products', async () => {
    const response = await request(app)
      .patch('/orders/632883492f58e39923fe1ac1')
      .send({
        productsToAdd: ['632883492f58e39923fe1ac5'],
        productsToDelete: ['632883492f58e39923fe1ac5']
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(true);
  });

  it('should update order status Resolved', async () => {
    const response = await request(app)
      .patch('/orders/632883492f58e39923fe1ac1')
      .send({
        orderStatus: '632883492f58e39923fe1ac6'
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(true);
  });

  it('should update order status Rejected', async () => {
    Orders.findByIdAndUpdate = () => {
      return {
        exec: () => ({
          id: '632883492f58e39923fe1ac1',
          products: ['632883492f58e39923fe1ac5'],
          status: '632883492f58e39923fe1ac7'
        })
      };
    };
    const response = await request(app)
      .patch('/orders/632883492f58e39923fe1ac1')
      .send({
        orderStatus: '632883492f58e39923fe1ac7'
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(true);
  });

  it('should return all users', async () => {
    const response = await request(app).get('/orders');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      id: '632883492f58e39923fe1ac1',
      products: ['632883492f58e39923fe1ac4'],
      status: '632883492f58e39923fe1ac2'
    });
  });

  it('should return all users with query params', async () => {
    const response = await request(app).get(
      '/orders/?_id=632883492f58e39923fe1ac1'
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      id: '632883492f58e39923fe1ac1',
      products: ['632883492f58e39923fe1ac4'],
      status: '632883492f58e39923fe1ac2'
    });
  });

  it('should delete order', async () => {
    const response = await request(app).delete(
      '/orders/632883492f58e39923fe1ac1'
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(true);
  });
});
