const { OrdersController } = require('..');
const { Orders } = require('../../models');
// const { Orders, OrderStatuses } = require('../../models');

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
          products: ['632883492f58e39923fe1ac4']
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
  }
}));

describe('Orders controller tests', function () {
  const ordersController = new OrdersController();

  const requestStub = {
    body: {
      products: ['632883492f58e39923fe1ac1']
    },
    params: {
      id: '6329881b69ac59cc3257c2fa'
    },
    query: {
      id: '632883492f58e39923fe1ac1',
      status: '63287edae38cbcaa5879227e'
    }
  };
  const responseStub = {
    boom: {
      badRequest: jest.fn(),
      notFound: jest.fn(),
      badImplementation: jest.fn()
    },
    json: (payload) => payload
  };

  it('should return all orders', async () => {
    const response = await ordersController.getOrders(
      requestStub,
      responseStub
    );

    expect(response).toEqual({
      total_size: 1,
      list: {
        id: '632883492f58e39923fe1ac1',
        products: ['632883492f58e39923fe1ac4'],
        status: '632883492f58e39923fe1ac2'
      }
    });
  });

  it('should return an empty array from orders', async () => {
    Orders.find = () => ({
      countDocuments: () => ({
        exec: () => 0
      }),
      exec: () => null
    });
    const response = await ordersController.getOrders(
      requestStub,
      responseStub
    );

    expect(response).toEqual({ list: [], total_size: 0 });
  });

  it('should return that order is not found on update', async () => {
    Orders.findByIdAndUpdate = () => ({
      exec: () => null
    });
    const response = await ordersController.updateOrder(
      requestStub,
      responseStub
    );

    expect(response).toBeFalsy();
  });

  it('should return that order is not found on delete', async () => {
    Orders.findByIdAndDelete = () => ({
      exec: () => null
    });
    const response = await ordersController.deleteOrder(
      requestStub,
      responseStub
    );

    expect(response).toBeFalsy();
  });
});
