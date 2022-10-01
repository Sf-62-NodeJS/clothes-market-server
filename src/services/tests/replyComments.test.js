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

    static findById () {
      return {
        exec: () => ({
          _id: '6335bbbf6d1e4900eff990af',
          userId: '06335760adbe069d28c1ed8bd',
          comment: 'comment 2'
        }),
        toString: () => '6335bbbf6d1e4900eff990af'
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
  },
  UserRoles: class UserRoles {
    static find () {
      return {
        exec: () => [
          {
            _id: '13ad122xa2ae',
            name: 'Admin'
          },
          {
            _id: '13ad122xa3ae',
            name: 'Super admin'
          }
        ]
      };
    }
  }
}));

describe('ReplyComments service tests', function () {
  const replyCommentsService = new ReplyCommentsService();
  const requestStub = {
    body: {
      userId: '06335760adbe069d28c1ed8bd',
      comment: 'comment',
      productId: '12354fiajs12345asdsd1234'
    },
    query: {
      productId: '12354fiajs12345asdsd1234'
    },
    params: {
      id: '13ad122xa2ae'
    },
    session: {
      passport: {
        user: {
          id: '06335760adbe069d28c1ed8bd',
          role: '13ad122xa2ae'
        }
      }
    }
  };

  const responseStub = {
    boom: {
      badRequest: jest.fn(),
      notFound: () => false,
      unauthorized: jest.fn()
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

  it('should return false on create category', async () => {
    jest
      .spyOn(ReplyComments.prototype, 'save')
      .mockImplementationOnce(() => false);
    const response = await replyCommentsService.createReplyComment(
      requestStub,
      responseStub
    );

    expect(response).toEqual(false);
  });

  it('should update reply comment', async () => {
    const response = await replyCommentsService.updateReplyComment(
      requestStub,
      responseStub
    );

    expect(response).toEqual(true);
  });

  it('should not find comment to update on authorized user', async () => {
    ReplyComments.findByIdAndUpdate = () => ({ exec: () => false });
    const response = await replyCommentsService.updateReplyComment(
      requestStub,
      responseStub
    );

    expect(response).toEqual(false);
  });

  it('Admin or Super admin should/not update comment', async () => {
    requestStub.session.passport.user.id = 'some user';
    requestStub.session.passport.user.role = 'some role';

    await replyCommentsService.updateReplyComment(requestStub, responseStub);

    expect(responseStub.boom.unauthorized).toBeCalled();
  });

  it('should not find a reply comment to update', async () => {
    ReplyComments.findById = () => ({ exec: () => false });
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
    requestStub.session.passport.user.id = '06335760adbe069d28c1ed8bd';
    ReplyComments.findById = () => ({
      exec: () => ({
        _id: '6335bbbf6d1e4900eff990af',
        userId: '06335760adbe069d28c1ed8bd',
        comment: 'comment 2'
      })
    });
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

  it('Admin or Super admin should/not delete comment', async () => {
    requestStub.session.passport.user.id = 'some user';
    requestStub.session.passport.user.role = 'some role';

    await replyCommentsService.deleteReplyComment(requestStub, responseStub);

    expect(responseStub.boom.unauthorized).toBeCalled();
  });

  it('should not find comment to delete', async () => {
    ReplyComments.findById = () => ({ exec: () => false });
    const response = await replyCommentsService.deleteReplyComment(
      requestStub,
      responseStub
    );

    expect(response).toBeFalsy();
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
