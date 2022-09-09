const verifyRole = require('../../auth/verifyRole');

describe('verifyRole tests', () => {
  const requestStub = {
    userInfo: {
      role: 'User'
    }
  };

  const requestStubFalse = {
    userInfo: {
      some: 'false'
    }
  };

  const responseStub = {
    boom: {
      unauthorized: jest.fn()
    }
  };
  const nextFunctionMock = jest.fn();

  it('should call next function on valid role', () => {
    const result = verifyRole('User');

    result(requestStub, responseStub, nextFunctionMock);

    expect(nextFunctionMock).toHaveBeenCalled();
    expect(responseStub.boom.unauthorized).not.toHaveBeenCalled();
  });

  it('should call unauthorized function on invalid role', () => {
    const result = verifyRole('Admin');

    result(requestStub, responseStub, nextFunctionMock);

    expect(responseStub.boom.unauthorized).toHaveBeenCalled();
  });

  it('should call unauthorized function when no role has been passed', () => {
    const result = verifyRole('Super admin');

    result(requestStubFalse, responseStub, nextFunctionMock);

    expect(responseStub.boom.unauthorized).toHaveBeenCalled();
  });
});
