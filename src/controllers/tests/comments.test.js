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
  }
}));

describe('Comments service tests', function () {
  const commentsController = new CommentsController();
  const requestStub = {
    headers: {
      authorization: 'some token'
    },
    userInfo: {
      role: 'Admin'
    },
    body: {
      comment: 'comment',
      productId: '12354fiajs12345asdsd1234'
    },
    query: {
      productId: '12354fiajs12345asdsd1234'
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
    Comments.findByIdAndDelete = () => ({ exec: () => false });
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
