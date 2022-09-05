const { nameCategoryPayloadValidator } = require('../../validators');

describe('nameCategoryPayloadValidator tests', () => {
  const requestStub = {
    body: {
      name: 'Name'
    }
  };
  const nextFunctionMock = jest.fn();
  const responseStub = {
    boom: {
      badRequest: jest.fn()
    }
  };

  it('should call next function on valid payload', () => {
    nameCategoryPayloadValidator(requestStub, responseStub, nextFunctionMock);

    expect(nextFunctionMock).toHaveBeenCalled();
    expect(responseStub.boom.badRequest).not.toHaveBeenCalled();
  });

  it('should call badRequest function on invalid payload', () => {
    requestStub.body.name = 'N';
    nameCategoryPayloadValidator(requestStub, responseStub, nextFunctionMock);

    expect(responseStub.boom.badRequest).toHaveBeenCalled();
  });
});
