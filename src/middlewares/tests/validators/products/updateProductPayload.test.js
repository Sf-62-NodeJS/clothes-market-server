const { updateProductPayloadValidator } = require('../../../validators');

describe('updateProductPayloadValidator tests', () => {
  const requestStub = {
    body: {
      name: 'Name',
      description: 'Description',
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
    updateProductPayloadValidator(
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
    updateProductPayloadValidator(
      requestStub,
      responseStub,
      nextFunctionMock
    );

    expect(responseStub.boom.badRequest).toHaveBeenCalled();
  });
});
