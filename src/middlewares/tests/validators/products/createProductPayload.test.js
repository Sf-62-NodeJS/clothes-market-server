const { createProductPayloadValidator } = require('../../../validators');

describe('createProductPayloadValidator tests', () => {
  const requestStub = {
    body: {
      name: 'Name',
      description: 'Description',
      category: '123456789123456789123456',
      sizes: '123456789123456789123456',
      price: 2.0
    }
  };
  const nextFunctionMock = jest.fn();
  const responseStub = {
    boom: {
      badRequest: jest.fn()
    }
  };

  it('should call next function on valid payload', () => {
    createProductPayloadValidator(
      requestStub,
      responseStub,
      nextFunctionMock
    );

    expect(nextFunctionMock).toHaveBeenCalled();
    expect(responseStub.boom.badRequest).not.toHaveBeenCalled();
  });

  it('should call badRequest function on invalid payload', () => {
    requestStub.body.name = 'N';
    requestStub.body.description = 'D';
    requestStub.body.price = 'P';
    createProductPayloadValidator(
      requestStub,
      responseStub,
      nextFunctionMock
    );

    expect(responseStub.boom.badRequest).toHaveBeenCalled();
  });
});
