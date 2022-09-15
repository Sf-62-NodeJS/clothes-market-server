const { SizesService } = require('..');
const { Sizes } = require('../../models');

jest.mock('../../models', () => ({
  Sizes: class Sizes {
    save () {
      return true;
    }
  }
}));
Sizes.exists = jest.fn();
Sizes.find = jest.fn();
Sizes.findByIdAndUpdate = jest.fn();
Sizes.findByIdAndDelete = jest.fn();

const execMock = jest.fn().mockReturnValue(true);

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

const sizesService = new SizesService();
describe('Sizes services tests', () => {
  describe('creating Size test', () => {
    it('should successfully create new Size', async () => {
      Sizes.exists.mockReturnValue({ exec: execMock });
      execMock.mockReturnValueOnce(false);

      await sizesService.createSize(requestStub, responseStub);
      expect(responseStub.json).toHaveBeenCalled();
      expect(responseStub.boom.badRequest).not.toHaveBeenCalled();
    });

    it('should return bad request when Size exists', async () => {
      Sizes.exists.mockReturnValue({ exec: execMock });
      execMock.mockReturnValueOnce(true);

      await sizesService.createSize(requestStub, responseStub);
      expect(responseStub.boom.badRequest).toHaveBeenCalled();
    });
  });

  describe('updating Size test', () => {
    it('successfully updates Size', async () => {
      Sizes.exists.mockReturnValue({ exec: execMock });
      execMock.mockReturnValueOnce(false);
      execMock.mockReturnValueOnce(true);

      Sizes.findByIdAndUpdate.mockReturnValueOnce({ exec: execMock });

      await sizesService.updateSize(requestStub, responseStub);
      expect(responseStub.json).toHaveBeenCalled();
      expect(responseStub.boom.notFound).not.toHaveBeenCalled();
    });

    it('fails when no Size with given id is found', async () => {
      Sizes.exists.mockReturnValue({ exec: execMock });
      execMock.mockReturnValueOnce(false);
      execMock.mockReturnValueOnce(false);

      Sizes.findByIdAndUpdate.mockReturnValueOnce({ exec: execMock });

      await sizesService.updateSize(requestStub, responseStub);
      expect(responseStub.boom.notFound).toHaveBeenCalled();
    });

    it('fails when Size value already exists', async () => {
      Sizes.exists.mockReturnValue({ exec: execMock });
      execMock.mockReturnValueOnce(true);
      execMock.mockReturnValueOnce(true);

      Sizes.findByIdAndUpdate.mockReturnValueOnce({ exec: execMock });

      await sizesService.updateSize(requestStub, responseStub);
      expect(responseStub.boom.badRequest).toBeCalledWith(
        'Sizes should be unique'
      );
    });

    it('fails when trying to change Size name with its own name', async () => {
      Sizes.exists.mockReturnValue({ exec: execMock });
      execMock.mockReturnValueOnce({ _id: '123' });
      execMock.mockReturnValueOnce(true);

      Sizes.findByIdAndUpdate.mockReturnValueOnce({ exec: execMock });

      await sizesService.updateSize(requestStub, responseStub);
      expect(responseStub.boom.badRequest).toBeCalledWith(
        'Size is alredy set to that value'
      );
    });
  });

  describe('deleting Size test', () => {
    it('successfully deletes Size', async () => {
      Sizes.findByIdAndDelete.mockReturnValue({ exec: execMock });
      execMock.mockReturnValue(true);
      await sizesService.deleteSize(requestStub, responseStub);
      expect(responseStub.json).toHaveBeenCalled();
      expect(responseStub.boom.notFound).not.toHaveBeenCalled();
    });

    it('fails when no Size is found', async () => {
      Sizes.findByIdAndDelete.mockReturnValue({ exec: execMock });
      execMock.mockReturnValue(false);
      await sizesService.deleteSize(requestStub, responseStub);
      expect(responseStub.boom.notFound).toHaveBeenCalled();
    });
  });

  describe('getting Sizes', () => {
    it('gets sizes when query is not given', async () => {
      const findSpy = jest.spyOn(Sizes, 'find');
      findSpy.mockReturnValue({ exec: execMock });
      execMock.mockReturnValue({ length: 1 });

      await sizesService.getSizes(requestStub, responseStub);

      expect(findSpy).toBeCalledWith({});
      expect(responseStub.boom.notFound).not.toHaveBeenCalled();
    });

    it('gets sizes when query is given', async () => {
      requestStub.query = {
        _id: '123',
        name: 'M'
      };
      const findSpy = jest.spyOn(Sizes, 'find');
      findSpy.mockReturnValue({ exec: execMock });
      execMock.mockReturnValue({ length: 1 });
      await sizesService.getSizes(requestStub, responseStub);

      expect(findSpy).toBeCalledWith(
        expect.objectContaining({
          _id: '123',
          name: 'M'
        })
      );
      expect(responseStub.json).toHaveBeenCalled();
      expect(responseStub.boom.notFound).not.toHaveBeenCalled();
    });

    it('returns not found when no Sizes found', async () => {
      const findSpy = jest.spyOn(Sizes, 'find');
      findSpy.mockReturnValue({ exec: execMock });
      execMock.mockReturnValue({ length: 0 });

      await sizesService.getSizes(requestStub, responseStub);

      expect(responseStub.boom.notFound).toHaveBeenCalled();
    });
  });
});
