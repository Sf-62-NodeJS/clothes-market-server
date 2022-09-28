const { updateOrderPayloadValidator } = require('../../../validators');

describe('updateOrderPayloadValidator tests', () => {
  const requestStub = {
    body: {
      name: 'Name',
      surname: 'Surname',
      middleName: 'Middlename',
      phoneNumber: '0898123456',
      address: 'Address 15',
      orderStatus: '632883492f58e39923fe1ac1',
      productsToAdd: ['632883492f58e39923fe1ac1', '632883492f58e39923fe1ac1'],
      productsToDelete: ['632883492f58e39923fe1ac1']
    }
  };
  const nextFunctionMock = jest.fn();
  const responseStub = {
    boom: {
      badRequest: jest.fn()
    }
  };

  it('should call next function on valid payload', () => {
    updateOrderPayloadValidator(requestStub, responseStub, nextFunctionMock);

    expect(nextFunctionMock).toHaveBeenCalled();
    expect(responseStub.boom.badRequest).not.toHaveBeenCalled();
  });

  it('should call badRequest function on invalid payload', () => {
    requestStub.body.products = ['632883492f5'];
    updateOrderPayloadValidator(requestStub, responseStub, nextFunctionMock);

    expect(responseStub.boom.badRequest).toHaveBeenCalled();
  });
});
