const UsersController = require('../users');
const { User } = require('../../models');
const { UserStatuses } = require('../../models');
const { Product } = require('../../models');

jest.mock('../../models', () => ({
  User: class User {
    constructor () {
      this.name = 'Name';
      this.middleName = 'middlename';
      this.surname = 'surname';
      this.email = 'email@gmail.com';
      this.password = 'somepassword';
      this.phoneNumber = '0897123456';
      this.address = 'address 10';
    }

    save () {
      return {
        id: '13ad122xa2ae',
        name: 'Name',
        middleName: 'middlename',
        surname: 'surname',
        email: 'email@gmail.com',
        password: 'dasasdasfdsad',
        phoneNumber: '0897123456',
        address: 'address 10'
      };
    }

    static find () {
      return {
        select: () => ({
          skip: () => ({
            limit: () => ({
              exec: () => ({
                id: '12ad122xa7e',
                name: 'Nameabc',
                middleName: 'middlename',
                surname: 'surname',
                email: 'email@gmail.com',
                phoneNumber: '0897123456',
                address: 'address 10'
              })
            })
          })
        }),
        countDocuments: () => ({
          exec: () => 1
        })
      };
    }

    static findByIdAndUpdate () {
      return {
        exec: () => ({
          id: '12ad122xa9e',
          name: 'Gosho',
          middleName: 'middlename',
          surname: 'surname',
          email: 'email@gmail.com',
          phoneNumber: '0897123456',
          address: 'address 10'
        })
      };
    }

    static findOne () {
      return {
        exec: () => ({
          _id: '12ad172xa9e',
          name: 'name4',
          middleName: 'middlename4',
          surname: 'surname4',
          email: 'email4@gmail.com',
          password: 'somepassword',
          phoneNumber: '0897133456',
          address: 'address 15',
          status: '52ad122xa7z'
        })
      };
    }
  },
  UserRoles: class UserRoles {
    static findOne () {
      return {
        exec: () => ({
          _id: '12ad122xa7b',
          name: 'User'
        })
      };
    }
  },
  UserStatuses: class UserStatuses {
    static findOne () {
      return {
        exec: () => ({
          _id: '12ad122xa7z',
          name: 'Active'
        })
      };
    }
  },
  Product: class Product {
    static findById () {
      return { sizes: ['1', '2', '3'] };
    }
  }
}));

jest.mock('bcryptjs', () => ({
  ...jest.requireActual('bcryptjs'),
  compare: () => true
}));

describe('usersController tests', () => {
  const usersController = new UsersController();
  const requestStub = {
    body: {
      name: 'Name'
    },
    params: {
      id: '12ad122xa3e'
    },
    query: {
      _id: '32423rsf3xv',
      name: 'name',
      email: 'email@gmail.com',
      status: '341taffjafa',
      role: '4214asfcxgaa',
      skip: 1,
      take: 1
    }
  };

  const responseStub = {
    boom: {
      badRequest: jest.fn(),
      badImplementation: jest.fn(),
      notFound: jest.fn()
    },
    json: (payload) => payload
  };

  it('should return all users', async () => {
    const users = await usersController.getUsers(requestStub, responseStub);

    expect(users).toEqual({
      total_size: 1,
      list: {
        id: '12ad122xa7e',
        name: 'Nameabc',
        middleName: 'middlename',
        surname: 'surname',
        email: 'email@gmail.com',
        phoneNumber: '0897123456',
        address: 'address 10'
      }
    });
  });

  it('should update user', async () => {
    User.findOne = () => {
      return {
        exec: () => ({
          _id: '12ad172xa9e',
          name: 'name4',
          middleName: 'middlename4',
          surname: 'surname4',
          email: 'email4@gmail.com',
          password: 'somepassword',
          phoneNumber: '0897133456',
          address: 'address 15',
          status: '12ad122xa7z'
        })
      };
    };
    const updatedUser = await usersController.updateUser(
      requestStub,
      responseStub
    );

    expect(updatedUser).toEqual(true);
  });

  it('should block user', async () => {
    User.findOne = () => {
      return {
        exec: () => ({
          _id: '12ad172xa9e',
          name: 'name4',
          middleName: 'middlename4',
          surname: 'surname4',
          email: 'email4@gmail.com',
          password: 'somepassword',
          phoneNumber: '0897133456',
          address: 'address 15',
          status: '52ad122xa7z'
        })
      };
    };
    UserStatuses.find = () => {
      return {
        exec: () => [
          {
            _id: '12ad122xa7w',
            name: 'Blocked'
          },
          {
            _id: '12ad122xa7b',
            name: 'Deleted'
          }
        ]
      };
    };
    const user = await usersController.blockUser(requestStub, responseStub);

    expect(user).toEqual(true);
  });

  it('should delete user', async () => {
    User.findOne = () => {
      return {
        exec: () => ({
          _id: '12ad172xa9e',
          name: 'name4',
          middleName: 'middlename4',
          surname: 'surname4',
          email: 'email4@gmail.com',
          password: 'somepassword',
          phoneNumber: '0897133456',
          address: 'address 15',
          status: '52ad122xa7z'
        })
      };
    };
    UserStatuses.findOne = () => {
      return {
        exec: () => ({
          _id: '12ad122xa7q',
          name: 'Deleted'
        })
      };
    };
    const user = await usersController.deleteUser(requestStub, responseStub);

    expect(user).toEqual(true);
  });
  describe('Add product to User cart test', () => {
    User.findById = jest.fn();
    Product.findById = jest.fn();
    User.updateOne = jest.fn();
    const execMock = jest.fn().mockReturnValue(true);

    requestStub.body = {
      productId: '1',
      sizeId: '1',
      quantity: 3
    };
    requestStub.session = {
      passport: {
        user: {
          id: 'someid'
        }
      }
    };

    it('should add product to cart when product in cart', async () => {
      User.findById.mockReturnValueOnce({ exec: execMock });
      execMock.mockReturnValueOnce({
        cart: [
          {
            productId: '1',
            sizeId: '1',
            quantity: 3
          }
        ]
      });
      Product.findById.mockReturnValueOnce({
        sizes: ['1', '2', '3']
      });
      User.updateOne.mockReturnValueOnce({ exec: execMock });

      const response = await usersController.addProductsToCart(
        requestStub,
        responseStub
      );
      expect(response).toBe(true);
    });
    it('should add product when product not in cart', async () => {
      Product.findById.mockReturnValueOnce({
        sizes: ['1', '2', '3']
      });
      User.findById.mockReturnValueOnce({ exec: execMock });
      User.updateOne.mockReturnValueOnce({ exec: execMock });
      execMock.mockReturnValueOnce({
        cart: [
          {
            productId: '2',
            sizeId: '1',
            quantity: 3
          }
        ]
      });
      const response = await usersController.addProductsToCart(
        requestStub,
        responseStub
      );
      expect(response).toBe(true);
    });
    it('should fail when Product not available in given Size', async () => {
      Product.findById.mockReturnValueOnce({
        sizes: ['2', '3']
      });
      User.findById.mockReturnValueOnce({ exec: execMock });
      execMock.mockReturnValueOnce({
        cart: [
          {
            productId: '2',
            sizeId: '2',
            quantity: 3
          }
        ]
      });
      await usersController.addProductsToCart(requestStub, responseStub);
      expect(responseStub.boom.badRequest).toBeCalledWith(
        'Product not available in this size'
      );
    });
    it('should fail when error thrown', async () => {
      User.findById.mockImplementationOnce(() => {
        throw Error('some error');
      });
      await usersController.addProductsToCart(requestStub, responseStub);
      expect(responseStub.boom.badImplementation).toBeCalled();
    });
  });
  describe('Delete product from User cart', () => {
    const execMock = jest.fn().mockReturnValue(true);
    it('should delete product', async () => {
      User.findById.mockReturnValueOnce({ exec: execMock });
      User.findByIdAndUpdate = jest
        .fn()
        .mockReturnValueOnce({ exec: execMock });
      execMock.mockReturnValueOnce({
        cart: [
          {
            productId: '1',
            sizeId: '1',
            quantity: 1
          }
        ]
      });
      execMock.mockReturnValueOnce({ some: 'object' });
      requestStub.body = {
        productId: '1',
        sizeId: '1',
        quantity: 1
      };
      const response = await usersController.deleteProductsFromCart(
        requestStub,
        responseStub
      );
      expect(response).toBe(true);
    });
    it('should fail when no card items found with given filter', async () => {
      User.findById.mockReturnValueOnce({ exec: execMock });
      execMock.mockReturnValueOnce({
        cart: [
          {
            productId: '1',
            sizeId: '1',
            quantity: 1
          }
        ]
      });
      requestStub.body = {
        productId: '2',
        sizeId: '1',
        quantity: 1
      };
      await usersController.deleteProductsFromCart(requestStub, responseStub);
      expect(responseStub.boom.notFound).toBeCalledWith(
        'No items with these parameters found.'
      );
    });
    it('should fail when an error occurs while pulling items', async () => {
      User.findById.mockReturnValueOnce({ exec: execMock });
      User.findByIdAndUpdate = jest
        .fn()
        .mockReturnValueOnce({ exec: execMock });
      execMock.mockReturnValueOnce({
        cart: [
          {
            productId: '1',
            sizeId: '1',
            quantity: 1
          }
        ]
      });
      execMock.mockReturnValueOnce(null);
      requestStub.body = {
        productId: '1',
        sizeId: '1',
        quantity: 1
      };

      await usersController.deleteProductsFromCart(requestStub, responseStub);
      expect(responseStub.boom.badRequest).toBeCalledWith(
        'An error occured while deleting product'
      );
    });
    it('should fail when an error is thrown', async () => {
      User.findById.mockImplementationOnce(() => {
        throw Error('some error');
      });
      await usersController.deleteProductsFromCart(requestStub, responseStub);
      expect(responseStub.boom.badImplementation).toBeCalled();
    });
  });
  describe('Retrieves products from User cart', () => {
    const execMock = jest.fn().mockReturnValue(true);
    it('should retrieve products', async () => {
      User.findById.mockReturnValueOnce({ exec: execMock });
      execMock.mockReturnValueOnce({
        cart: [
          {
            productId: '1',
            sizeId: '1',
            quantity: 1
          }
        ]
      });
      requestStub.query = {
        productId: '1',
        sizeId: '1',
        quantity: 1
      };
      const response = await usersController.getProductsFromCart(
        requestStub,
        responseStub
      );
      expect(response).toMatchObject([
        { productId: '1', sizeId: '1', quantity: 1 }
      ]);
    });
    it('should fail when no items found', async () => {
      User.findById.mockReturnValueOnce({ exec: execMock });
      execMock.mockReturnValueOnce({
        cart: [
          {
            productId: '2',
            sizeId: '1',
            quantity: 1
          }
        ]
      });
      await usersController.getProductsFromCart(requestStub, responseStub);
      expect(responseStub.boom.notFound).toBeCalledWith(
        'No cart items with these parameters found'
      );
    });
    it('should fail when error thrown', async () => {
      User.findById.mockImplementationOnce(() => {
        throw Error('some error');
      });
      await usersController.getProductsFromCart(requestStub, responseStub);
      expect(responseStub.boom.badImplementation).toBeCalled();
    });
  });
});
