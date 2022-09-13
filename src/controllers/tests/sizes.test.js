const { SizesController } = require('..');
const { Sizes } = require('../../models');

jest.mock('../../models', () => ({
  Sizes: class Sizes {
    save () {
      return true;
    }

    static exists () {
      return false;
    }

    static findOne () {
      return true;
    }

    static find () {
      return jest.fn();
    }
  }
}));
// Sizes.find = jest.fn(async () => []);
Sizes.exists = jest.fn(() => false);

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
  boom: {
    badRequest: jest.fn(),
    notFound: jest.fn()
  },
  json: jest.fn()
};

describe('Sizes controller test', () => {
  describe('creating Size test', () => {
    it('should successfully create new Size', async () => {
      Sizes.exists = jest.fn();
      Sizes.exists.mockReturnValueOnce(false);
      Sizes.exists.mockReturnValueOnce({ id: '123' });

      await sizesController.createSize(requestStub, responseStub);
      expect(responseStub.json).toHaveBeenCalled();
      expect(responseStub.boom.badRequest).not.toHaveBeenCalled();
    });

    it('should return bad request when Size exists', async () => {
      Sizes.exists = () => true;
      await sizesController.createSize(requestStub, responseStub);
      expect(responseStub.boom.badRequest).toHaveBeenCalled();
    });
  });

  describe('updateSize', () => {
    it('successfully updates Size', async () => {
      Sizes.exists = jest.fn();
      Sizes.exists.mockReturnValueOnce(false);
      Sizes.exists.mockReturnValueOnce({ id: '123' });
      Sizes.findByIdAndUpdate = () => ({ name: 'M' });
      await sizesController.updateSize(requestStub, responseStub);
      expect(responseStub.json).toHaveBeenCalled();
      expect(responseStub.boom.notFound).not.toHaveBeenCalled();
    });

    it('fails when no Size is found', async () => {
      Sizes.exists = jest.fn();
      Sizes.exists.mockReturnValueOnce(true);
      Sizes.exists.mockReturnValueOnce(false);
      await sizesController.updateSize(requestStub, responseStub);
      expect(responseStub.boom.notFound).toHaveBeenCalled();
    });

    it('fails when Size already exists', async () => {
      Sizes.exists = jest.fn();
      Sizes.exists.mockReturnValueOnce({ id: '123' });
      Sizes.exists.mockReturnValueOnce(true);
      await sizesController.updateSize(requestStub, responseStub);
      expect(responseStub.boom.badRequest).toBeCalledWith(
        'Sizes should be unique'
      );
    });

    it('fails when trying to change Size name with its own name', async () => {
      Sizes.exists = jest.fn();
      Sizes.exists.mockReturnValueOnce({ _id: '123' });
      Sizes.exists.mockReturnValueOnce(true);

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
