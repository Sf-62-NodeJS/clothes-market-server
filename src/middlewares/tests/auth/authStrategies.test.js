/* eslint-disable no-unused-vars */
const { User } = require('../../../models');
const { authStrategies } = require('../../auth');
const bcrypt = require('bcryptjs');

jest.mock('../../../models', () => ({
  User: class User {
    static findOne () {
      return {
        exec: () => ({
          _id: '12ad172xa9e',
          name: 'name4',
          middleName: 'middlename4',
          surname: 'surname4',
          email: 'email4@gmail.com',
          password: 'somepassword',
          phoneNumber: '0897133456',
          address: 'address 15',
          status: '12ad122xa7z'
        })
      };
    }
  },
  UserStatuses: class UserStatuses {
    static findOne () {
      return {
        exec: () => ({
          _id: '12ad122xa7z',
          name: 'Active'
        })
      };
    }
  },
  UserRoles: class UserRoles {
    static findOne () {
      return {
        exec: () => ({
          _id: '12ad122xa7b',
          name: 'User'
        })
      };
    }
  }
}));

jest.mock('bcryptjs');

describe('userAuthentication tests', () => {
  const requestStub = {
    body: {
      email: 'email@email.com',
      password: 'password'
    }
  };

  const profileStub = {
    role: 'User',
    name: 'Name',
    displayName: 'DisplayName'
  };

  const doneStub = jest.fn();

  const requestGoogleStub = jest.fn();
  const accessTokenGoogleStub = jest.fn();
  const refreshTokenGoogleStub = jest.fn();

  it('should return done on verifyGoogle', async () => {
    await authStrategies.verifyGoogle(
      requestGoogleStub,
      accessTokenGoogleStub,
      refreshTokenGoogleStub,
      profileStub,
      doneStub
    );

    expect(doneStub).toHaveBeenCalled();
  });

  it('should return done on successful check', async () => {
    bcrypt.compare.mockResolvedValue(true);

    await authStrategies.verifyCustom(requestStub, doneStub);

    expect(doneStub).toHaveBeenCalled();
  });

  it('should return done on unsuccessful password check', async () => {
    bcrypt.compare.mockResolvedValue(false);

    await authStrategies.verifyCustom(requestStub, doneStub);

    expect(doneStub).toHaveBeenCalled();
  });

  it('should return done on unsuccessful user check', async () => {
    User.findOne = () => {
      return {
        exec: () => null
      };
    };

    await authStrategies.verifyCustom(requestStub, doneStub);

    expect(doneStub).toHaveBeenCalled();
  });
});
