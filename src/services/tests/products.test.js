const { ProductsService } = require('..');
const { Product, Categories } = require('../../models');

jest.mock('../../models', () => ({
  Product: class Product {
    save () {
      return {
        id: '16ad122xa2ae',
        name: 'Name',
        files: 'img.png',
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

jest.mock('fs', () => ({
  unlink: jest.fn()
}));

describe('Products service tests', function () {
  const productsService = new ProductsService();
  const requestStub = {
    headers: {
      authorization: 'some token'
    },
    userInfo: {
      role: 'Admin'
    },
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
      badRequest: jest.fn(),
      notFound: jest.fn()
    },
    json: (payload) => payload
  };

  it('should create product', async () => {
    const response = await productsService.createProduct(
      requestStub,
      responseStub
    );

    expect(response).toEqual({
      id: '16ad122xa2ae',
      name: 'Name',
      files: 'img.png',
      category: '16cat122xa2ae',
      sizes: ['16size122xa2ae', '16size222xa2ae'],
      status: '16stat122xa2ae',
      comments: ['16comm122xa2ae', '16comm222xa2ae'],
      price: 2.0
    });
  });

  it('should return that category does not exist on create product', async () => {
    Categories.findOne = () => ({ exec: () => null });
    const response = await productsService.createProduct(
      requestStub,
      responseStub
    );

    expect(response).toBeFalsy();
  });

  it('should return all products', async () => {
    const response = await productsService.getProducts(
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

  it('should return an empty array from products', async () => {
    Product.find = () => ({
      count: () => 0,
      skip: () => ({
        limit: () => ({
          exec: () => null
        })
      })
    });
    const response = await productsService.getProducts(
      requestStub,
      responseStub
    );

    expect(response).toEqual({ list: [], total_size: 0 });
  });

  it('should return updated product by id', async () => {
    Categories.findOne = () => ({ exec: () => ({ _id: '123asdasd' }) });
    const response = await productsService.updateProduct(
      requestStub,
      responseStub
    );

    expect(response).toEqual(true);
  });

  it('should return product not exist when update', async () => {
    Product.findById = () => ({
      exec: () => false
    });
    const response = await productsService.updateProduct(
      requestStub,
      responseStub
    );

    expect(response).toBeFalsy();
  });

  it('should return that category does not exist on update product', async () => {
    Product.findById = () => ({
      exec: () => true
    });
    Categories.findOne = () => ({ exec: () => null });
    const response = await productsService.updateProduct(
      requestStub,
      responseStub
    );

    expect(response).toBeFalsy();
  });

  it('should return deleted product by id', async () => {
    const response = await productsService.deleteProduct(
      requestStub,
      responseStub
    );

    expect(response).toEqual(true);
  });

  it('throws an error while trying to delete product by id that doesn\'t exist', async () => {
    Product.findByIdAndDelete = () => ({
      exec: () => false
    });
    const response = await productsService.deleteProduct(
      requestStub,
      responseStub
    );

    expect(response).toBeFalsy();
  });
});
