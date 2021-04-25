'use strict';

const pg = require('../src/db.js');
// const pg = require('pg');
// const client = new pg.Client("postgres://adamra:123456@localhost:5432/linkedlearntest");
const superTest = require('supertest');
const { app } = require('../src/server');
const request = superTest(app);
let adminUser = {
  username: 'afnan',
  password: '123456',
};
let tUser = {
  username: 'ruba',
  password: '123456',
};
let sUser = {
  username: 'zaid',
  password: '123456',
};
let aToken, tToken, sToken;

describe('==================AUTH==================', () => {
  beforeAll(async () => {
    await pg.connect();
  });

  afterAll(async () => {
    await pg.end();
  });
  it('can sign in as admin', async () => {
    const response = await request
      .post('/auth/signin')
      .set(
        'Authorization',
        'basic ' +
          new Buffer.from(
            `${adminUser.username}:${adminUser.password}`,
            'utf8'
          ).toString('base64')
      );
    // const response = request
    //   .post('/auth/signin')
    //   .set('Authorization', 'Basic YWZuYW46MTIzNDU2');
    aToken = response.body.token;
    expect(response.status).toEqual(200);
    expect(response.body.user.username).toBe('afnan');
    expect(response.body.user.role).toBe('admin');
  });
  it('can sign in as teacher', async () => {
    const response = await request
      .post('/auth/signin')
      .set(
        'Authorization',
        'basic ' +
          new Buffer.from(
            `${tUser.username}:${tUser.password}`,
            'utf8'
          ).toString('base64')
      );
    tToken = response.body.token;
    expect(response.status).toEqual(200);
    expect(response.body.user.username).toBe('ruba');
    expect(response.body.user.role).toBe('teacher');
  });
  it('can sign in as student', async () => {
    const response = await request
      .post('/auth/signin')
      .set(
        'Authorization',
        'basic ' +
          new Buffer.from(
            `${sUser.username}:${sUser.password}`,
            'utf8'
          ).toString('base64')
      );
    sToken = response.body.token;
    expect(response.status).toEqual(200);
    expect(response.body.user.username).toBe('zaid');
    expect(response.body.user.role).toBe('student');
  });
  it('can access admin routes with admin token', async () => {
    const response = await request.get('/auth/users').set('Authorization',
    'bearer ' + aToken);
    expect(response.status).toEqual(200);
  });
  it('can access teachers routes with teacher token', async () => {
    const response = await request.get('/auth/teacher').set('Authorization',
    'bearer ' + tToken);
    expect(response.status).toEqual(200);
  });
  it('can access students routes with student token', async () => {
    const response = await request.get('/auth/student').set('Authorization',
    'bearer ' + sToken);
    expect(response.status).toEqual(200);
  });
  it('should create a new teacher user on POST /signup', async () => {
    let newUser = {
      username: 'bashar',
      password: '123456',
      email: 'bashar@gm.com',
      role: 'teacher',
    };
    const response = await request.post('/auth/signup').send(newUser);
    expect(response.status).toEqual(201);
    expect(response.body.user.username).toEqual(newUser.username);
  });

});
