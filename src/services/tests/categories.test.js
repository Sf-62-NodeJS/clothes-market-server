const { CategoriesService } = require('..');
const { Categories, Product } = require('../../models');

jest.mock('../../models', () => ({
  Categories: class Categories {
    save () {
      return true;
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
  },
  Product: class Product {
    static find () {
      return { exec: () => false };
    }
  }
}));

describe('Categories service tests', function () {
  const categoriesService = new CategoriesService();
  const requestStub = {
    headers: {
      authorization: 'some token'
    },
    userInfo: {
      role: 'Admin'
    },
    body: {
      name: 'Name'
    },
    query: {
      _id: '13ad122xa2ae',
      name: 'Name'
    },
    params: {
      id: '13ad122xa2ae'
    }
  };

  const responseStub = {
    boom: {
      badRequest: jest.fn(),
      notFound: () => false
    },
    json: (payload) => payload
  };

  it('should create category', async () => {
    const response = await categoriesService.createCategory(
      requestStub,
      responseStub
    );

    expect(response).toEqual(true);
  });

  it('should update category', async () => {
    const response = await categoriesService.updateCategory(
      requestStub,
      responseStub
    );

    expect(response).toEqual(true);
  });

  it('should not find a category to update', async () => {
    Categories.findByIdAndUpdate = () => ({ exec: () => false });
    const response = await categoriesService.updateCategory(
      requestStub,
      responseStub
    );

    expect(response).toEqual(false);
  });

  it('should return all categories', async () => {
    const response = await categoriesService.getCategories(
      requestStub,
      responseStub
    );

    expect(response).toEqual({
      list: {
        id: '13ad122xa2ae',
        name: 'Name'
      },
      total_size: 1
    });
  });

  it('should return no categories', async () => {
    Categories.find = () => ({
      count: () => 0,
      exec: () => null
    });
    const response = await categoriesService.getCategories(
      requestStub,
      responseStub
    );

    expect(response).toEqual({
      list: [],
      total_size: 0
    });
  });

  it('should delete category', async () => {
    Categories.findByIdAndDelete = () => ({ exec: () => true });
    const response = await categoriesService.deleteCategory(
      requestStub,
      responseStub
    );

    expect(response).toEqual(true);
  });

  it('throws an error while trying to delete category that still have products', async () => {
    Product.find = () => ({ exec: () => ['Product'] });
    const response = await categoriesService.deleteCategory(
      requestStub,
      responseStub
    );

    expect(response).toBeFalsy();
  });
});
