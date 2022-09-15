const { productImageService } = require('..');
const fs = require('fs');

jest.mock('uuid', () => ({
  v4: () => '00000000-0000-0000-0000-000000000000'
}));

jest.mock('fs', () => ({
  unlink: jest.fn()
}));

describe('Upload product image tests', function () {
  let requestStub = {
    body: {
      image: 'stg'
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
      badRequest: jest.fn()
    },
    json: (payload) => payload
  };

  it('should upload an image and return imageName.jpg', async () => {
    const response = await productImageService.uploadImage(
      requestStub,
      responseStub
    );

    expect(response).toEqual('00000000-0000-0000-0000-000000000000.jpg');
  });

  it('should upload an image and return imageName.png', async () => {
    requestStub = {
      body: {
        image: 'stg'
      },
      files: {
        image: {
          name: 'test.png',
          mimetype: 'image/png',
          mv: jest.fn()
        }
      }
    };

    const response = await productImageService.uploadImage(
      requestStub,
      responseStub
    );

    expect(response).toEqual('00000000-0000-0000-0000-000000000000.png');
  });

  it('should delete imageName.imageExtension', async () => {
    const response = await productImageService.deleteImage('imageName.jpg');

    expect(response).toEqual(true);
  });

  it('throws an error while trying to delete an image', async () => {
    jest.spyOn(fs, 'unlink').mockImplementation((_, callback) =>
      callback(Error('some error'))
    );

    console.error = jest.fn();

    await productImageService.deleteImage('do-not-exist.jpg');

    expect(console.error).toHaveBeenCalled();
  });
});
