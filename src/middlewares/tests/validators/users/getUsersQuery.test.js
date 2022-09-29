const { getUsersQueryValidator } = require('../../../validators');

describe('getUsersQueryValidator tests', () => {
  const requestStub = {
    query: {
      _id: '630f51a601db34bca1f8b19f',
      name: 'Name',
      email: 'testEmail@gmail.com',
      status: '630f51a601db34bca1f8b19f',
      role: '630f51a601db34bca1f8b19f',
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
    getUsersQueryValidator(requestStub, responseStub, nextFunctionMock);

    expect(nextFunctionMock).toHaveBeenCalled();
    expect(responseStub.boom.badRequest).not.toHaveBeenCalled();
  });

  it('should call badRequest function on invalid payload', () => {
    requestStub.query.name = 'N';
    getUsersQueryValidator(requestStub, responseStub, nextFunctionMock);

    expect(responseStub.boom.badRequest).toHaveBeenCalled();
  });
});
