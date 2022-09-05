const { SizesService } = require('..');
const { Sizes } = require('../../models');

jest.mock('../../models', () => ({
  Sizes: class Sizes {
    async save () {
      return true;
    }

    static async exists () {
      return false;
    }
  }
}));

const requestStub = {
  body: {
    name: 'M'
  },
  params: {
    id: '12312124'
  }
};
const responseStub = {
  boom: {
    badRequest: jest.fn(),
    notFound: jest.fn()
  },
  json: jest.fn()
};

const sizesService = new SizesService();

describe('creating Size test', () => {
  it('should successfully create new Size', async () => {
    await sizesService.createSize(requestStub, responseStub);
    expect(responseStub.json).toHaveBeenCalled();
    expect(responseStub.boom.badRequest).not.toHaveBeenCalled();
  });

  it('should return bad request when Size exists', async () => {
    Sizes.exists = async () => true;
    await sizesService.createSize(requestStub, responseStub);
    expect(responseStub.boom.badRequest).toHaveBeenCalled();
  });
});

describe('updating Size test', () => {
  it('successfully updates Size', async () => {
    Sizes.findByIdAndUpdate = () => ({ name: 'M' });
    await sizesService.updateSize(requestStub, responseStub);
    expect(responseStub.json).toHaveBeenCalled();
    expect(responseStub.boom.notFound).not.toHaveBeenCalled();
  });

  it('fails when no Size is found', async () => {
    Sizes.findByIdAndUpdate = () => 0;
    await sizesService.updateSize(requestStub, responseStub);
    expect(responseStub.boom.notFound).toHaveBeenCalled();
  });
});

describe('deleting Size test', () => {
  it('successfully deletes Size', async () => {
    Sizes.findByIdAndDelete = () => ({ name: 'M' });
    await sizesService.deleteSize(requestStub, responseStub);
    expect(responseStub.json).toHaveBeenCalled();
    expect(responseStub.boom.notFound).not.toHaveBeenCalled();
  });

  it('fails when no Size is found', async () => {
    Sizes.findByIdAndDelete = () => 0;
    await sizesService.deleteSize(requestStub, responseStub);
    expect(responseStub.boom.notFound).toHaveBeenCalled();
  });
});

describe('getting Size test', () => {
  it('successfully gets the product', async () => {
    Sizes.findById = () => ({ name: 'M' });
    await sizesService.getSize(requestStub, responseStub);
    expect(responseStub.json).toHaveBeenCalled();
    expect(responseStub.boom.notFound).not.toHaveBeenCalled();
  });

  it('fails when no Size is found', async () => {
    Sizes.findById = () => null;
    await sizesService.getSize(requestStub, responseStub);
    expect(responseStub.boom.notFound).toHaveBeenCalled();
  });
});
