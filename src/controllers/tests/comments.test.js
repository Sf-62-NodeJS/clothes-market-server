const { CommentsController } = require('..');
const { Comments, Product } = require('../../models');

jest.mock('../../models', () => ({
  Comments: class Comments {
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
          comment: 'comment 2',
          replyComments: [
            '06335760adbe069d28c1ed8bd',
            '6335bbbf6d1e4900eff990af'
          ]
        })
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
        exec: () => ({ _id: '123124125', replyComments: [{ id: '312312123' }] })
      };
    }
  },
  Product: class Product {
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
  ReplyComments: class ReplyComments {
    static deleteMany () {
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

describe('Comments controller tests', function () {
  const commentsController = new CommentsController();
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

  it('should create comment', async () => {
    const response = await commentsController.createComment(
      requestStub,
      responseStub
    );

    expect(response).toEqual(true);
  });

  it('should update comment', async () => {
    const response = await commentsController.updateComment(
      requestStub,
      responseStub
    );

    expect(response).toEqual(true);
  });

  it('should not find a comment to update', async () => {
    Comments.findByIdAndUpdate = () => ({ exec: () => false });
    const response = await commentsController.updateComment(
      requestStub,
      responseStub
    );

    expect(response).toEqual(false);
  });

  it('should return all comments', async () => {
    const response = await commentsController.getComments(
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

  it('should return no comments', async () => {
    Comments.find = () => ({
      count: () => 0,
      exec: () => null
    });
    const response = await commentsController.getComments(
      requestStub,
      responseStub
    );

    expect(response).toEqual({
      list: [],
      total_size: 0
    });
  });

  it('should delete comment', async () => {
    const response = await commentsController.deleteComment(
      requestStub,
      responseStub
    );

    expect(response).toEqual(true);
  });

  it('should not find comment to delete', async () => {
    Comments.findById = () => ({ exec: () => false });
    const response = await commentsController.deleteComment(
      requestStub,
      responseStub
    );

    expect(response).toBeFalsy();
  });

  it('should not create comment because product is not found', async () => {
    Product.findById = () => ({ exec: () => false });

    const response = await commentsController.createComment(
      requestStub,
      responseStub
    );

    expect(response).toBeFalsy();
  });

  it('should not get comments because product is not found', async () => {
    Product.findById = () => ({ exec: () => false });

    const response = await commentsController.getComments(
      requestStub,
      responseStub
    );

    expect(response).toBeFalsy();
  });
});
