import request from 'supertest';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { expect } from 'chai';
chai.use(chaiHttp);
import User from '../models/userModel';
// import mongoose from 'mongoose';
import app from '../../app';
describe('Auth endpoints', () => {
  before(async () => {
    try {
      //connection
      // await mongoose.connect('mongodb://127.0.0.1:27017/My-brand-BE')
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
  });

  before((done) => {
    User.deleteMany({}, (err) => {
      done();
    });
  });

  it('should create a new user and return a token', async () => {
    const response = await request(app).post('/api/users/signup').send({
      name: 'Test User',
      email: 'test1@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      role: 'user',
    });
    // console.log(response)
    expect(response).to.have.status(201);
    expect(response.body).to.have.property('token');
    expect(response.body).to.have.property('data');
  });
  it('should login a user successfully and return a token', async () => {
    const response = await request(app).post('/api/users/login').send({
      email: 'test1@example.com',
      password: 'password123',
    });
    expect(response).to.have.status(200);
    expect(response.body).to.have.property('token');
  });
  it('should return enter email and password', async () => {
    const response = await request(app).post('/api/users/login').send({});
    expect(response).to.have.status(400);
    expect(response.body.message).to.equal('Enter email and password');
  });
  it('should return incorrect email or password', async () => {
    const response = await request(app).post('/api/users/login').send({
      email: 'test1@example.com',
      password: 'password124',
    });
    expect(response).to.have.status(401);
    expect(response.body.message).to.equal('Incorrect password or email');
  });
});
