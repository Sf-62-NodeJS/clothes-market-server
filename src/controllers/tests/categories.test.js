const { CategoriesController } = require('../');
const { Categories } = require('../../models');

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
  }
}));

describe('Categories controller tests', function () {
  const categoriesController = new CategoriesController();
  const requestStub = {
    body: {
      name: 'Name'
    },
    query: {
      name: 'Name'
    },
    params: {
      id: '13ad122xa2ae'
    }
  };

  const responseStub = {
    boom: {
      badRequest: () => ({
        statusCode: 400,
        error: 'Bad request',
        message: 'Category already exists.'
      })
    },
    json: (payload) => payload
  };

  it('should create category', async () => {
    const response = await categoriesController.createCategory(
      requestStub,
      responseStub
    );

    expect(response).toEqual({
      id: '13ad122xa2ae',
      name: 'Name'
    });
  });

  it('should return an error while trying to create a category', async () => {
    Categories.findOne = () => ({
      exec: () => 'some'
    });

    const response = await categoriesController.createCategory(
      requestStub,
      responseStub
    );

    expect(response).toEqual({
      statusCode: 400,
      error: 'Bad request',
      message: 'Category already exists.'
    });
  });

  it('should update category', async () => {
    Categories.findOne = () => ({
      exec: () => null
    });

    const response = await categoriesController.updateCategory(
      requestStub,
      responseStub
    );

    expect(response).toEqual(true);
  });

  it('should return an error while trying to update a category', async () => {
    Categories.findOne = () => ({
      exec: () => 'some'
    });

    const response = await categoriesController.updateCategory(
      requestStub,
      responseStub
    );

    expect(response).toEqual({
      statusCode: 400,
      error: 'Bad request',
      message: 'Category already exists.'
    });
  });

  it('should return all categories', async () => {
    const response = await categoriesController.getCategories(
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
    const response = await categoriesController.deleteCategory(
      requestStub,
      responseStub
    );

    expect(response).toEqual(true);
  });
});
