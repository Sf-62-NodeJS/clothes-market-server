const checkAuth = require('../../auth/checkAuth');
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken');

describe('checkAuth tests', () => {
  const requestStub = {
    headers: {
      authorization: 'some token'
    }
  };
  const responseStub = {
    boom: {
      badRequest: jest.fn()
    }
  };
  const nextFunctionMock = jest.fn();

  it('should call next function on valid token', () => {
    jwt.verify = jest.fn().mockImplementationOnce((token, secret, cb) => {
      cb(null, {});
    });

    checkAuth(requestStub, responseStub, nextFunctionMock);

    expect(nextFunctionMock).toHaveBeenCalled();
    expect(responseStub.boom.badRequest).not.toHaveBeenCalled();
  });

  it('should call badRequest function on invalid token', () => {
    jwt.verify = jest.fn().mockImplementationOnce((token, secret, cb) => {
      cb(new Error('some error'), {});
    });

    checkAuth(requestStub, responseStub, nextFunctionMock);

    expect(responseStub.boom.badRequest).toHaveBeenCalled();
  });

  it('should call badRequest function when no token value has been passed', () => {
    requestStub.headers.authorization = null;
    checkAuth(requestStub, responseStub, nextFunctionMock);

    expect(responseStub.boom.badRequest).toHaveBeenCalled();
  });
});
