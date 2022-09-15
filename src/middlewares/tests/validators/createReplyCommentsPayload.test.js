const { createReplyCommentsPayloadValidator } = require('../../validators');

describe('createReplyCommentsPayloadValidator tests', () => {
  const requestStub = {
    body: {
      comment: 'Comment',
      commentId: '12354fiajs12345asdsd1234'
    }
  };
  const nextFunctionMock = jest.fn();
  const responseStub = {
    boom: {
      badRequest: jest.fn()
    }
  };

  it('should call next function on valid payload', () => {
    createReplyCommentsPayloadValidator(
      requestStub,
      responseStub,
      nextFunctionMock
    );

    expect(nextFunctionMock).toHaveBeenCalled();
    expect(responseStub.boom.badRequest).not.toHaveBeenCalled();
  });

  it('should call badRequest function on invalid payload', () => {
    requestStub.body.name = 'N';
    createReplyCommentsPayloadValidator(
      requestStub,
      responseStub,
      nextFunctionMock
    );

    expect(responseStub.boom.badRequest).toHaveBeenCalled();
  });
});
