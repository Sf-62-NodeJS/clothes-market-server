const { User, UserStatuses } = require('../../../models');
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
          email: 'email@gmail.com',
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
  }
}));

jest.mock('bcryptjs');

jest.mock('../../../services', () => ({
  UsersService: class UsersService {
    async createUser () {
      return true;
    }
  }
}));

const doneStub = jest.fn();

describe('userAuthentication verifyCustom tests', () => {
  const requestStub = {
    body: {
      email: 'email@email.com',
      password: 'password'
    }
  };

  const profileStub = {
    given_name: 'Name',
    family_name: 'Surname',
    id: '123456789123456789',
    email: 'email@gmail.com'
  };

  const requestGoogleStub = jest.fn();
  const accessTokenGoogleStub = jest.fn();
  const refreshTokenGoogleStub = jest.fn();

  it('Custom should return done on successful check', async () => {
    bcrypt.compare.mockResolvedValue(true);

    await authStrategies.verifyCustom(requestStub, doneStub);

    expect(doneStub).toHaveBeenCalled();
  });

  it('Custom should return done on unsuccessful password check', async () => {
    bcrypt.compare.mockResolvedValue(false);

    await authStrategies.verifyCustom(requestStub, doneStub);

    expect(doneStub).toHaveBeenCalled();
  });

  it('Google should return done on successful user check', async () => {
    await authStrategies.verifyGoogle(
      requestGoogleStub,
      accessTokenGoogleStub,
      refreshTokenGoogleStub,
      profileStub,
      doneStub
    );

    expect(doneStub).toHaveBeenCalled();
  });

  it('Custom should return done on unsuccessful user status check', async () => {
    UserStatuses.findOne = () => {
      return {
        exec: () => ({ _id: 'Active' })
      };
    };

    await authStrategies.verifyCustom(requestStub, doneStub);

    expect(doneStub).toHaveBeenCalled();
  });

  it('Google should return done on unsuccessful user check', async () => {
    User.findOne = () => {
      return {
        exec: () => null
      };
    };

    await authStrategies.verifyGoogle(
      requestGoogleStub,
      accessTokenGoogleStub,
      refreshTokenGoogleStub,
      profileStub,
      doneStub
    );

    expect(doneStub).toHaveBeenCalled();
  });

  it('Custom should return done on unsuccessful user check', async () => {
    User.find = () => {
      return {
        exec: () => false
      };
    };

    await authStrategies.verifyCustom(requestStub, doneStub);

    expect(doneStub).toHaveBeenCalled();
  });
});
