const { SizesController } = require('..');
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
Sizes.find = jest.fn(async () => []);

const sizesController = new SizesController();

const requestStub = {
  body: {
    name: 'M'
  },
  params: {
    id: '123'
  },
  query: {}
};
const responseStub = {
  json: jest.fn(() => true),
  boom: {
    badRequest: jest.fn(),
    notFound: jest.fn()
  }
};

describe('Sizes controller test', () => {
  describe('createSize', () => {
    it('should successfully create new Size', async () => {
      await sizesController.createSize(requestStub, responseStub);
      expect(responseStub.json).toHaveBeenCalled();
      expect(responseStub.boom.badRequest).not.toHaveBeenCalled();
    });

    it('should return bad request when Size exists', async () => {
      Sizes.exists = async () => true;
      await sizesController.createSize(requestStub, responseStub);
      expect(responseStub.boom.badRequest).toHaveBeenCalled();
    });
  });

  describe('updateSize', () => {
    it('successfully updates Size', async () => {
      Sizes.findByIdAndUpdate = () => ({ name: 'M' });
      Sizes.findOne = () => null;
      await sizesController.updateSize(requestStub, responseStub);
      expect(responseStub.json).toHaveBeenCalled();
      expect(responseStub.boom.notFound).not.toHaveBeenCalled();
    });

    it('fails when no Size is found', async () => {
      Sizes.findByIdAndUpdate = () => null;
      Sizes.findOne = () => null;

      await sizesController.updateSize(requestStub, responseStub);
      expect(responseStub.boom.notFound).toHaveBeenCalled();
    });

    it('fails when Size already exists', async () => {
      Sizes.findByIdAndUpdate = () => null;
      Sizes.findOne = () => ({
        name: 'M',
        _id: 'someid'
      });

      await sizesController.updateSize(requestStub, responseStub);
      expect(responseStub.boom.badRequest).toBeCalledWith(
        'Sizes should be unique'
      );
    });

    it('fails when trying to change Size name with its own name', async () => {
      Sizes.findByIdAndUpdate = () => null;
      Sizes.findOne = () => ({
        name: 'M',
        _id: '123'
      });

      await sizesController.updateSize(requestStub, responseStub);
      expect(responseStub.boom.badRequest).toBeCalledWith(
        'Size is alredy set to that value'
      );
    });
  });
  describe('deleting Size test', () => {
    it('successfully deletes Size', async () => {
      Sizes.findByIdAndDelete = () => ({ name: 'M' });
      await sizesController.deleteSize(requestStub, responseStub);
      expect(responseStub.json).toHaveBeenCalled();
      expect(responseStub.boom.notFound).not.toHaveBeenCalled();
    });

    it('fails when no Size is found', async () => {
      Sizes.findByIdAndDelete = () => 0;
      await sizesController.deleteSize(requestStub, responseStub);
      expect(responseStub.boom.notFound).toHaveBeenCalled();
    });
  });
  describe('getting Sizes', () => {
    it('gets sizes when query is not given', async () => {
      const findSpy = jest.spyOn(Sizes, 'find');
      findSpy.mockReturnValue({ length: 1 });

      await sizesController.getSizes(requestStub, responseStub);

      expect(findSpy).toBeCalledWith({});
    });

    it('gets sizes when query is given', async () => {
      requestStub.query = {
        _id: '123',
        name: 'M'
      };
      const findSpy = jest.spyOn(Sizes, 'find');
      findSpy.mockReturnValue({ length: 1 });

      await sizesController.getSizes(requestStub, responseStub);

      expect(findSpy).toBeCalledWith(
        expect.objectContaining({
          _id: '123',
          name: 'M'
        })
      );
      expect(responseStub.json).toHaveBeenCalled();
    });

    it('fails when no Sizes found', async () => {
      const findSpy = jest.spyOn(Sizes, 'find');
      findSpy.mockReturnValue({ length: 0 });

      await sizesController.getSizes(requestStub, responseStub);

      expect(responseStub.boom.notFound).toHaveBeenCalled();
    });
  });
});
