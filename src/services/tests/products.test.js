const { ProductsService } = require('..');

jest.mock('../../models', () => ({
  Product: class Product {
    save () {
      return {
        id: '16ad122xa2ae',
        name: 'Name',
        imageUrl: 'https://www.com',
        category: '16cat122xa2ae',
        sizes: ['16size122xa2ae', '16size222xa2ae'],
        status: '16stat122xa2ae',
        comments: ['16comm122xa2ae', '16comm222xa2ae'],
        price: 2.0
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
          name: 'Name',
          imageUrl: 'https://www.com',
          category: '18cat122xa3e',
          sizes: ['18size122xa2ae', '18size222xa2ae'],
          status: '18stat122xa2ae',
          comments: ['18comm122xa2ae', '18comm222xa2ae'],
          price: 3.0
        })
      };
    }

    static findByIdAndDelete () {
      return {
        exec: () => ({
          id: '19ad122xa3e',
          name: 'N',
          imageUrl: 'https://www.com',
          category: '19cat122xa3e',
          sizes: ['19size122xa2ae', '19size222xa2ae'],
          status: '19stat122xa2ae',
          comments: ['19comm122xa2ae', '19comm222xa2ae'],
          price: 2.0
        })
      };
    }
  }
}));

describe('Products service tests', function () {
  const productsService = new ProductsService();
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
    }
  };

  const responseStub = {
    boom: {
      badRequest: jest.fn()
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
      imageUrl: 'https://www.com',
      category: '16cat122xa2ae',
      sizes: ['16size122xa2ae', '16size222xa2ae'],
      status: '16stat122xa2ae',
      comments: ['16comm122xa2ae', '16comm222xa2ae'],
      price: 2.0
    });
  });

  it('should return all products', async () => {
    const response = await productsService.getProducts(
      requestStub,
      responseStub
    );

    expect(response).toEqual({
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
    const response = await productsService.updateProduct(
      requestStub,
      responseStub
    );

    expect(response).toEqual({
      id: '18ad122xa3e',
      name: 'Name',
      imageUrl: 'https://www.com',
      category: '18cat122xa3e',
      sizes: ['18size122xa2ae', '18size222xa2ae'],
      status: '18stat122xa2ae',
      comments: ['18comm122xa2ae', '18comm222xa2ae'],
      price: 3.0
    });
  });

  it('should return deleted product by id', async () => {
    const response = await productsService.deleteProduct(
      requestStub,
      responseStub
    );

    expect(response).toEqual({
      id: '19ad122xa3e',
      name: 'N',
      imageUrl: 'https://www.com',
      category: '19cat122xa3e',
      sizes: ['19size122xa2ae', '19size222xa2ae'],
      status: '19stat122xa2ae',
      comments: ['19comm122xa2ae', '19comm222xa2ae'],
      price: 2.0
    });
  });
});
