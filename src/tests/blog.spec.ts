import request from 'supertest';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { expect } from 'chai';
chai.use(chaiHttp);
// import mongoose from 'mongoose';
import app from '../../app';
import Blog from '../models/blogsModal';
// import path from 'path';
describe('Blog Endpoints', () => {
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

  before((done) => {
    Blog.deleteMany({}, (err) => {
      done();
    });
  });
  let userToken = '';
  let adminToken = '';
  //   const img = path.resolve('./tests');
  it('should login a user successfully and return a token', async () => {
    const response = await request(app).post('/api/users/login').send({
      email: 'test1@example.com',
      password: 'password123',
    });
    userToken = response.body.token;
  });
  it('should ask a user to login first', async () => {
    const response = await request(app).post('/api/blog').send({});
    expect(response).to.have.status(401);
    expect(response.body.message).to.equal(
      'You are not logined in. Please login'
    );
  });
  it('should ask a user to login as admin', async () => {
    const response = await request(app)
      .post('/api/blog')
      .set('authorization', `Bearer ${userToken}`)
      .send({});
    expect(response).to.have.status(403);
    expect(response.body.message).to.equal('Login As An Administrator');
  });
  it('should return invalid blog details', async () => {
    const res = await request(app).post('/api/users/signup').send({
      name: 'Test User',
      email: 'test2@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      role: 'admin',
    });
    adminToken = res.body.token;
    const response = await request(app)
      .post('/api/blog')
      .set('authorization', `Bearer ${adminToken}`)
      .send({});
    expect(response).to.have.status(403);
    expect(response.body.message).to.equal('Invalid blog details');
  });
  //   it('should successful create a blog', async () => {
  //     const response = await request(app)
  //       .post('/api/blog')
  //       .set('authorization', `Bearer ${adminToken}`)
  //       .field({
  //         title: 'testing an image',
  //         content: 'lorem ipsum test',
  //       })
  //       .attach('image', `${img}/smartwatch.png`);
  //     console.log('====================================');
  //     console.log(response);
  //     console.log('====================================');
  //     expect(response).to.have.status(201);
  //     expect(response.body.message).to.equal('Invalid blog details');
  //   });
  it('should return all blogs', async () => {
    const response = await request(app)
      .get('/api/blog')
      .set('authorization', `Bearer ${adminToken}`);
    expect(response).to.have.status(200);
    expect(response.body.status).to.equal('success');
  });
});
