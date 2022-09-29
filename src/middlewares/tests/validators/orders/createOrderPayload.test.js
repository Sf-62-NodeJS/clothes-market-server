const { createOrderPayloadValidator } = require('../../../validators');

describe('createOrderPayloadValidator tests', () => {
  const requestStub = {
    body: {
      name: 'Name',
      surname: 'Surname',
      middleName: 'Middlename',
      phoneNumber: '0898123456',
      address: 'Address 15',
      products: ['632883492f58e39923fe1ac1']
    }
  };
  const nextFunctionMock = jest.fn();
  const responseStub = {
    boom: {
      badRequest: jest.fn()
    }
  };

  it('should call next function on valid payload', () => {
    createOrderPayloadValidator(requestStub, responseStub, nextFunctionMock);

    expect(nextFunctionMock).toHaveBeenCalled();
    expect(responseStub.boom.badRequest).not.toHaveBeenCalled();
  });

  it('should call badRequest function on invalid payload', () => {
    requestStub.body.products = ['632883492f5'];
    createOrderPayloadValidator(requestStub, responseStub, nextFunctionMock);

    expect(responseStub.boom.badRequest).toHaveBeenCalled();
  });
});
