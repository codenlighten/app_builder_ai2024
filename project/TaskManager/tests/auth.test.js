import request from 'supertest';
import app from '../server';
import User from '../models/User';
import mongoose from 'mongoose';

/**
 * Connects to the database and clears the User collection before running tests.
 */
beforeAll = () => {
await mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    await User.deleteMany();
}

/**
 * Closes the database connection after all tests have run.
 */
afterAll = () => {
await mongoose.connection.close();
}

/**
 * Tests the user registration endpoint to ensure it creates a new user and returns a token.
 */
testUserRegistration = () => {
const response = await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser', password: 'testpass' });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
}

/**
 * Tests the user login endpoint to ensure it authenticates the user and returns a token.
 */
testUserLogin = () => {
const response = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'testpass' });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
}

/**
 * Tests the user login endpoint with invalid credentials to ensure it returns an error.
 */
testInvalidLogin = () => {
const response = await request(app)
      .post('/api/auth/login')
      .send({ username: 'wronguser', password: 'wrongpass' });
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Invalid credentials');
}

// Import necessary modules
const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const mongoose = require('mongoose');

// Connect to the database before all tests
beforeAll(async () => {
  await mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  await User.deleteMany(); // Clear the User collection
});

// Close the database connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

// Test user registration
test('User registration', async () => {
  const response = await request(app)
    .post('/api/auth/register')
    .send({ username: 'testuser', password: 'testpass' });
  expect(response.status).toBe(201);
  expect(response.body).toHaveProperty('token');
});

// Test user login
test('User login', async () => {
  const response = await request(app)
    .post('/api/auth/login')
    .send({ username: 'testuser', password: 'testpass' });
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty('token');
});

// Test invalid login
test('Invalid login', async () => {
  const response = await request(app)
    .post('/api/auth/login')
    .send({ username: 'wronguser', password: 'wrongpass' });
  expect(response.status).toBe(401);
  expect(response.body).toHaveProperty('message', 'Invalid credentials');
});
export {"default":"describe('Authentication Tests', () => {","end":"});"};
