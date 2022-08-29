const { updateUserPayloadValidator } = require('../../validators');

describe('updateUserPayloadValidator tests', () => {
  const requestStub = {
    body: {
      name: 'Name',
      surname: 'Surname',
      middleName: 'Middlename',
      password: 'asd32rr4tsdf',
      phoneNumber: '0898123456',
      address: 'Address 15'
    }
  };
  const nextFunctionMock = jest.fn();
  const responseStub = {
    boom: {
      badRequest: jest.fn()
    }
  };

  it('should call next function on valid payload', () => {
    updateUserPayloadValidator(requestStub, responseStub, nextFunctionMock);

    expect(nextFunctionMock).toHaveBeenCalled();
    expect(responseStub.boom.badRequest).not.toHaveBeenCalled();
  });

  it('should call badRequest function on invalid payload', () => {
    requestStub.body.name = 'N';
    updateUserPayloadValidator(requestStub, responseStub, nextFunctionMock);

    expect(responseStub.boom.badRequest).toHaveBeenCalled();
  });
});
