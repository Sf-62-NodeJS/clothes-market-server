const { addProductToCartPayloadValidator } = require('../../validators/');

describe('addProductToCartPayloadValidator test', () => {
  const requestStub = {
    body: {
      productId: '632841cf1151537f982af04a',
      sizeId: '632841cf1151537f982af04b',
      quantity: 1
    }
  };
  const responseStub = {
    boom: {
      badRequest: jest.fn()
    }
  };
  const next = jest.fn();
  it('should call next function on valid payload', () => {
    addProductToCartPayloadValidator(requestStub, responseStub, next);
    expect(next).toBeCalled();
  });
  it('should fail on invalid payload', () => {
    requestStub.body.quantity = 0;
    addProductToCartPayloadValidator(requestStub, responseStub, next);
    expect(responseStub.boom.badRequest).toBeCalled();
  });
});
