import request from 'supertest';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { expect } from 'chai';
chai.use(chaiHttp);
// import mongoose from 'mongoose';
import app from '../../app';
describe('Message endpoints', () => {
  before(async () => {
    try {
      // await mongoose.connect('mongodb://127.0.0.1:27017/Todo-dbs', {
      //   useNewUrlParser: true,
      //   useUnifiedTopology: true,
      // });
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
  });
  it('should create a new user and return a token', async () => {
    const response = await request(app)
      .post('/api/messages')
      .send({
        firstname: 'Test',
        lastname: 'User',
        email: 'test1@example.com',
        phone: '0780403244',
        message: 'hi fam',
      });
    expect(response).to.have.status(201);
    expect(response.body.message).to.equal('Message has been sent');
  });
});
