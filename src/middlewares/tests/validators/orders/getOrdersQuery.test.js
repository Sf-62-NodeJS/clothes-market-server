const { getOrdersQueryValidator } = require('../../../validators');

describe('getOrdersQueryValidator tests', () => {
  const requestStub = {
    query: {
      _id: '630f51a601db34bca1f8b19f',
      status: '630f51a601db34bca1f8b19f',
      name: 'Name',
      skip: 1,
      take: 50
    }
  };
  const nextFunctionMock = jest.fn();
  const responseStub = {
    boom: {
      badRequest: jest.fn()
    }
  };

  it('should call next function on valid payload', () => {
    getOrdersQueryValidator(requestStub, responseStub, nextFunctionMock);

    expect(nextFunctionMock).toHaveBeenCalled();
    expect(responseStub.boom.badRequest).not.toHaveBeenCalled();
  });

  it('should call badRequest function on invalid payload', () => {
    requestStub.query.name = 'N';
    getOrdersQueryValidator(requestStub, responseStub, nextFunctionMock);

    expect(responseStub.boom.badRequest).toHaveBeenCalled();
  });
});
