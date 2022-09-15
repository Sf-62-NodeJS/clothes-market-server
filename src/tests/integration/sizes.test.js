const app = require('../../index');
const request = require('supertest');
const { Sizes } = require('../../models');

jest.mock('../../models', () => ({
  Sizes: class Sizes {
    save () {
      return true;
    }
  }
}));
const execMock = jest.fn().mockReturnValue(true);

Sizes.exists = jest.fn();
Sizes.find = jest.fn();
Sizes.findByIdAndUpdate = jest.fn();
Sizes.findByIdAndDelete = jest.fn();

describe('Integration test for collection Sizes', () => {
  describe('create Size', () => {
    it('should create new size', async () => {
      Sizes.exists.mockReturnValue({ exec: execMock });
      execMock.mockReturnValueOnce(false);

      const response = await request(app).post('/sizes').send({ name: 'M' });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(true);
    });
    it('fail on existing item', async () => {
      Sizes.exists.mockReturnValue({ exec: execMock });
      execMock.mockReturnValueOnce(true);

      const response = await request(app).post('/sizes').send({ name: 'M' });

      expect(response.statusCode).toBe(400);
      expect(response.body).not.toEqual(true);
    });
  });
  describe('update Size', () => {
    it('successfully updates Size', async () => {
      Sizes.exists.mockReturnValue({ exec: execMock });
      execMock.mockReturnValueOnce(false);
      execMock.mockReturnValueOnce(true);

      Sizes.findByIdAndUpdate.mockReturnValueOnce({ exec: execMock });

      const response = await request(app)
        .put('/sizes/632038e4397c3144b81e9d8c')
        .send({ name: 'L' });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(true);
    });
  });
  describe('get Sizes', () => {
    it('successfully gets Sizes', async () => {
      const findSpy = jest.spyOn(Sizes, 'find');
      findSpy.mockReturnValue({ exec: execMock });
      execMock.mockReturnValue([
        {
          name: 'M',
          _id: '632038e4397c3144b81e9d8c',
          __v: '0'
        },
        {
          name: 'L',
          _id: '632038e4397c3144b81e9d82',
          __v: '0'
        }
      ]);

      const response = await request(app).get('/sizes').send({ name: 'L' });

      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body).toMatchObject([
        {
          name: 'M',
          _id: '632038e4397c3144b81e9d8c',
          __v: '0'
        },
        {
          name: 'L',
          _id: '632038e4397c3144b81e9d82',
          __v: '0'
        }
      ]);
    });
  });
  describe('delete Size', () => {
    it('should delete size', async () => {
      Sizes.findByIdAndDelete.mockReturnValue({ exec: execMock });
      execMock.mockReturnValue(true);

      const response = await request(app).delete(
        '/sizes/632038e4397c3144b81e9d8c'
      );

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(true);
    });
  });
});
