const dotenv = require("dotenv");
const mongoose = require("mongoose");
const chaii = require("chai");
import supertest from 'supertest'
const request=supertest.request;

const expect=chaii.expect

dotenv.config({ path: "./config.env" });

describe("Database Connection", () => {
  before(async function() {
    try {
      const DB =
        "mongodb+srv://mugishajoseph092:qpEJUA0F4YTqELut@my-brand.ixhj4md.mongodb.net/my-brand-BE";
      await mongoose.connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      });
      console.log("Connected to MongoDB");
      await mongoose.connection.db.dropCollection("users");
      console.log("Db Cleared");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      process.exit(1);
    }
  });

  after(async function() {
    try {
      await mongoose.connection.close();
    } catch (error) {
      console.error("Error closing MongoDB connection:", error);
    }
  });

  it('No Credentials provided', async () => {
    const response = await request(app).post('/api/users/login/').send({});
    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal('Enter email and password');
});
});