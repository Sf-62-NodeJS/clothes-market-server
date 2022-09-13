const ProductsController = require('../products');

jest.mock('fs', () => ({
  unlink: jest.fn()
}));

jest.mock('../../models', () => ({
  Product: class Product {
    save () {
      return {
        id: '16ad122xa2ae',
        name: 'Name',
        image: 'img.png',
        category: '16cat122xa2ae',
        sizes: ['16size122xa2ae', '16size222xa2ae'],
        status: '16stat122xa2ae',
        comments: ['16comm122xa2ae', '16comm222xa2ae'],
        price: 2.0
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
        exec: () => ({ image: 'image.jpg', comments: 'comment' })
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
  },
  Comments: class Comments {
    static find () {
      return {
        exec: () => [
          { _id: '123124125', replyComments: [{ id: '312312123' }] },
          { id: '123124125' }
        ]
      };
    }

    static deleteMany () {
      return { exec: () => true };
    }
  },
  ReplyComments: class ReplyComments {
    static deleteMany () {
      return { exec: () => true };
    }
  }
}));

describe('productsController tests', function () {
  const productsController = new ProductsController();
  const requestStub = {
    body: {
      name: 'Name',
      price: 3.0
    },
    params: {
      id: '15ad122xa3e'
    },
    query: {
      skip: 1,
      take: 1
    },
    files: {
      image: {
        name: 'test.jpg',
        mimetype: 'image/jpeg',
        mv: jest.fn()
      }
    }
  };

  const responseStub = {
    boom: {
      badRequest: jest.fn()
    },
    json: (payload) => payload
  };

  it('should create product', async () => {
    const response = await productsController.createProduct(
      requestStub,
      responseStub
    );

    expect(response).toEqual({
      id: '16ad122xa2ae',
      name: 'Name',
      image: 'img.png',
      category: '16cat122xa2ae',
      sizes: ['16size122xa2ae', '16size222xa2ae'],
      status: '16stat122xa2ae',
      comments: ['16comm122xa2ae', '16comm222xa2ae'],
      price: 2.0
    });
  });

  it('should return all products', async () => {
    const response = await productsController.getProducts(
      requestStub,
      responseStub
    );

    expect(response).toEqual({
      list: {
        id: '17ad122xa3e',
        name: 'N',
        image: 'img.png',
        category: '17cat122xa3e',
        sizes: ['17size122xa2ae', '17size222xa2ae'],
        status: '17stat122xa2ae',
        comments: ['17comm122xa2ae', '17comm222xa2ae'],
        price: 2.0
      },
      total_size: 1
    });
  });

  it('should return updated product by id', async () => {
    const response = await productsController.updateProduct(
      requestStub,
      responseStub
    );

    expect(response).toEqual(true);
  });

  it('should return deleted product by id', async () => {
    const response = await productsController.deleteProduct(
      requestStub,
      responseStub
    );

    expect(response).toEqual(true);
  });
});
