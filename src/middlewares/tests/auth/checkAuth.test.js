require('dotenv').config();
const userAuthenticateJWS = require('../../auth/checkAuth');
const jwt = require('jsonwebtoken');

describe('checkAuth tests', () => {
  const requestStub = {
    headers: {
      authorization: undefined
    }
  };
  const responseStub = {
    boom: {
      badRequest: jest.fn()
    }
  };
  const nextFunctionMock = jest.fn();

  const user = {
    name: 'SomeName',
    password: 'SomePassword'
  };

  const accessToken = jwt.sign(user, process.env.JWT_SECRET);

  requestStub.headers.authorization = accessToken;

  it('should call next function on valid user', () => {
    userAuthenticateJWS(requestStub, responseStub, nextFunctionMock);
    expect(nextFunctionMock).toHaveBeenCalled();
    expect(responseStub.boom.badRequest).not.toHaveBeenCalled();
  });

  it('should call badRequest function on invalid token', () => {
    requestStub.headers.authorization = undefined;
    userAuthenticateJWS(requestStub, responseStub, nextFunctionMock);

    expect(responseStub.boom.badRequest).toHaveBeenCalled();
  });
});
