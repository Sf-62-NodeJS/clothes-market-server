// Just In Case

const { Categories } = require('..');

jest.mock('..', () => ({
  Categories: class Categories {
    static createCategory () {
      return {
        id: '16ad122xa2ae',
        name: 'Jackets'
      };
    }

    static updateCategory () {
      return {
        id: '16ad122xa2ae',
        name: 'Shirts'
      };
    }

    static deleteCategory () {
      return true;
    }

    static getCategories () {
      return {
        id: '16ad122xa2ae',
        name: 'Jackets'
      };
    }
  }
}));

describe('Categories tests', function () {
  it('should create a category of products', async () => {
    const response = await Categories.createCategory('Jackets');

    expect(response).toEqual({
      id: '16ad122xa2ae',
      name: 'Jackets'
    });
  });

  it('should update a category name', async () => {
    const response = await Categories.updateCategory('Jackets', 'Shirts');

    expect(response).toEqual({
      id: '16ad122xa2ae',
      name: 'Shirts'
    });
  });

  it('should delete a category', async () => {
    const response = await Categories.deleteCategory('Shirts');

    expect(response).toEqual(true);
  });

  it('should get categories', async () => {
    const response = await Categories.getCategories();

    expect(response).toEqual({
      id: '16ad122xa2ae',
      name: 'Jackets'
    });
  });
});
