const { CategoriesService } = require('..');

jest.mock('../../models', () => ({
  Categories: class Categories {
    save () {
      return {
        id: '13ad122xa2ae',
        name: 'Name'
      };
    }

    static findByIdAndUpdate () {
      return {
        exec: () => true
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
  }
}));

describe('Categories service tests', function () {
  const categoriesService = new CategoriesService();
  const requestStub = {
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
      badRequest: jest.fn()
    },
    json: (payload) => payload
  };

  it('should create category', async () => {
    const response = await categoriesService.createCategory(
      requestStub,
      responseStub
    );

    expect(response).toEqual({
      id: '13ad122xa2ae',
      name: 'Name'
    });
  });

  it('should update category', async () => {
    const response = await categoriesService.updateCategory(
      requestStub,
      responseStub
    );

    expect(response).toEqual(true);
  });

  it('should return all categories', async () => {
    const response = await categoriesService.getCategories(
      requestStub,
      responseStub
    );

    expect(response).toEqual({
      categories: {
        id: '13ad122xa2ae',
        name: 'Name'
      },
      total_number: 1
    });
  });

  it('should delete category', async () => {
    const response = await categoriesService.deleteCategory(
      requestStub,
      responseStub
    );

    expect(response).toEqual(true);
  });
});
