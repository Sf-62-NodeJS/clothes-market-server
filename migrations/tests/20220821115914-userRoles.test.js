const { up, down } = require('../20220821115914-userRoles');

describe('20220821115914-userRoles migration tests', () => {
  const deleteManyMock = jest.fn();
  const insertManyMock = jest.fn();
  const dbStub = {
    collection: () => ({
      deleteMany: deleteManyMock,
      insertMany: insertManyMock
    })
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call deleteMany and insert many mocks while calling up method', async () => {
    await up(dbStub);

    expect(deleteManyMock).toHaveBeenCalled();
    expect(insertManyMock).toHaveBeenCalled();
  });

  it('should call deleteMany mock while calling down method', async () => {
    await down(dbStub);

    expect(deleteManyMock).toHaveBeenCalled();
  });

  it('throws an error while connecting to db when calling up method and calls console.error method', async () => {
    insertManyMock.mockImplementation(() => {
      throw new Error();
    });

    console.error = jest.fn();
    await up(dbStub);

    expect(console.error).toHaveBeenCalled();
  });

  it('throws an error while connecting to db when calling down method and calls console.error method', async () => {
    deleteManyMock.mockImplementation(() => {
      throw new Error();
    });

    console.error = jest.fn();
    await down(dbStub);

    expect(console.error).toHaveBeenCalled();
  });
});
