const { ReplyCommentsService } = require('..');
const { ReplyComments, Comments } = require('../../models');

jest.mock('../../models', () => ({
  ReplyComments: class ReplyComments {
    save () {
      return true;
    }

    static findByIdAndUpdate () {
      return {
        exec: () => true
      };
    }

    static findOne () {
      return {
        exec: () => null
      };
    }

    static find () {
      return {
        exec: () => ({
          id: '13ad122xa2ae',
          name: 'Name'
        }),
        count: () => 1
      };
    }

    static findByIdAndDelete () {
      return {
        exec: () => true
      };
    }
  },
  Comments: class Comments {
    static findById () {
      return {
        exec: () => true
      };
    }

    static findByIdAndUpdate () {
      return {
        exec: () => true
      };
    }

    static findOneAndUpdate () {
      return {
        exec: () => true
      };
    }

    static updateOne () {
      return {
        exec: () => true
      };
    }
  }
}));

describe('ReplyComments service tests', function () {
  const replyCommentsService = new ReplyCommentsService();
  const requestStub = {
    body: {
      name: 'Name'
    },
    query: {
      commentId: '12354fiajs12345asdsd1234',
      name: 'Name'
    },
    params: {
      id: '13ad122xa2ae'
    }
  };

  const responseStub = {
    boom: {
      badRequest: jest.fn(),
      notFound: () => false
    },
    json: (payload) => payload
  };

  it('should create reply comment', async () => {
    const response = await replyCommentsService.createReplyComment(
      requestStub,
      responseStub
    );

    expect(response).toEqual(true);
  });

  it('should update reply comment', async () => {
    const response = await replyCommentsService.updateReplyComment(
      requestStub,
      responseStub
    );

    expect(response).toEqual(true);
  });

  it('should not find a reply comment to update', async () => {
    ReplyComments.findByIdAndUpdate = () => ({ exec: () => false });
    const response = await replyCommentsService.updateReplyComment(
      requestStub,
      responseStub
    );

    expect(response).toEqual(false);
  });

  it('should return all reply comments', async () => {
    const response = await replyCommentsService.getReplyComments(
      requestStub,
      responseStub
    );

    expect(response).toEqual({
      list: {
        id: '13ad122xa2ae',
        name: 'Name'
      },
      total_size: 1
    });
  });

  it('should return no reply comments', async () => {
    ReplyComments.find = () => ({
      count: () => 0,
      exec: () => null
    });
    const response = await replyCommentsService.getReplyComments(
      requestStub,
      responseStub
    );

    expect(response).toEqual({
      list: [],
      total_size: 0
    });
  });

  it('should delete reply comment', async () => {
    const response = await replyCommentsService.deleteReplyComment(
      requestStub,
      responseStub
    );

    expect(response).toEqual(true);
  });

  it('should not delete reply comment', async () => {
    ReplyComments.findByIdAndDelete = () => ({ exec: () => false });
    const response = await replyCommentsService.deleteReplyComment(
      requestStub,
      responseStub
    );

    expect(response).toEqual(false);
  });

  it('should not create reply comment because comment is not found', async () => {
    Comments.findById = () => ({ exec: () => false });

    const response = await replyCommentsService.createReplyComment(
      requestStub,
      responseStub
    );

    expect(response).toBeFalsy();
  });

  it('should not get reply comments because comment is not found', async () => {
    const response = await replyCommentsService.getReplyComments(
      requestStub,
      responseStub
    );

    expect(response).toBeFalsy();
  });
});
