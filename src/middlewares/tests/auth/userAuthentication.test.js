const userAuthentication = require('../../auth/userAuthentication');
const { UserRoles } = require('../../../models');

describe('userAuthentication tests', () => {
  const requestStub = {
    session: {
      passport: {
        user: { role: '123userroleid' }
      }
    }
  };

  const requestStubFalse = {
    session: {
      some: 'false'
    }
  };

  const responseStub = {
    boom: {
      unauthorized: jest.fn()
    }
  };

  const nextFunctionMock = jest.fn();

  it('should call next function on valid role', async () => {
    UserRoles.find = () => ({
      exec: () => [
        {
          _id: '123userroleid',
          name: 'User'
        }
      ]
    });
    const result = userAuthentication('User');

    await result(requestStub, responseStub, nextFunctionMock);

    expect(nextFunctionMock).toHaveBeenCalled();
    expect(responseStub.boom.unauthorized).not.toHaveBeenCalled();
  });

  it('should call unauthorized function on invalid role', async () => {
    UserRoles.find = () => ({
      exec: () => [
        {
          _id: '123adminroleid',
          name: 'Admin'
        }
      ]
    });
    const result = userAuthentication('Admin');

    await result(requestStub, responseStub, nextFunctionMock);

    expect(responseStub.boom.unauthorized).toHaveBeenCalled();
  });

  it('should call unauthorized function when no role has been passed', () => {
    const result = userAuthentication('Super admin');

    result(requestStubFalse, responseStub, nextFunctionMock);

    expect(responseStub.boom.unauthorized).toHaveBeenCalled();
  });
});
