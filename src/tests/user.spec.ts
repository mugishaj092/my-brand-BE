import request from 'supertest';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { expect } from 'chai';
chai.use(chaiHttp);
// import User from '../models/userModel';
// import mongoose from 'mongoose';
import app from '../../app';
describe('Auth endpoints', () => {
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
  let adminToken = '';
  it('should return all users', async () => {
    const res = await request(app).post('/api/users/signup').send({
      name: 'Test User',
      email: 'test3@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      role: 'admin',
    });
    adminToken = res.body.token;
    const response = await request(app)
      .get('/api/users')
      .set('authorization', `Bearer ${adminToken}`);
    expect(response).to.have.status(200);
    expect(response.body.status).to.equal('success');
    process.exit(0);
  });
});
