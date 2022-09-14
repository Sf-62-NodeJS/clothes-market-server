const { updateUserPasswordPayloadValidator } = require('../../validators');

describe('updateUserPasswordPayloadValidator tests', () => {
  const requestStub = {
    body: {
      oldPassword: 'oldPassword123',
      newPassword: 'newPassword12345'
    }
  };
  const nextFunctionMock = jest.fn();
  const responseStub = {
    boom: {
      badRequest: jest.fn()
    }
  };

  it('should call next function on valid payload', () => {
    updateUserPasswordPayloadValidator(
      requestStub,
      responseStub,
      nextFunctionMock
    );

    expect(nextFunctionMock).toHaveBeenCalled();
    expect(responseStub.boom.badRequest).not.toHaveBeenCalled();
  });

  it('should call badRequest function on invalid payload', () => {
    requestStub.body.oldPassword = 'p';
    updateUserPasswordPayloadValidator(
      requestStub,
      responseStub,
      nextFunctionMock
    );

    expect(responseStub.boom.badRequest).toHaveBeenCalled();
  });
});
