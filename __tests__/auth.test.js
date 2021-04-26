'use strict';

const client = require('../src/db.js');
// const pg = require('pg');
// const client = new pg.Client({
//     user     : 'adamra',
//     password : '123456',
//     database : 'linkedlearntest',
//     host     : 'localhost',
//     port     : '5432'
//   });

// const client = new pg.Client('postgres://adamra:123456@localhost:5432/linkedlearntest');
const supertest = require('supertest');
const { app } = require('../src/server');
const request = supertest(app);
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
let aToken, tToken, sToken, id;

describe('==================AUTH==================', () => {
  beforeAll(async () => {
    await client.connect();
    // await client.query(`DROP DATABASE IF EXISTS linkedlearntest;`);
    // await client.query(`CREATE DATABASE linkedlearntest;`);
    await client.query(`DROP TABLE IF EXISTS auth CASCADE;

    DROP TYPE IF EXISTS roles;
    CREATE TYPE roles AS enum('admin', 'teacher', 'student');
    
    CREATE TABLE IF NOT EXISTS auth(
        id SERIAL PRIMARY KEY,
        username VARCHAR (255) UNIQUE NOT NULL,
        password VARCHAR (255) NOT NULL,
        email VARCHAR (255) UNIQUE NOT NULL,
        role roles DEFAULT 'student' NOT NULL
    );
    INSERT INTO auth (username, password, email, role) values ('afnan', '$2b$10$bU2t0RLijsvFs6hdfCDqT.HSFXCw2i.cjvILr6.mVxvn3Q587Rz8e', 'afnan@gm.com', 'admin') RETURNING *;
    INSERT INTO auth (username, password, email, role) values ('ruba', '$2b$10$bU2t0RLijsvFs6hdfCDqT.HSFXCw2i.cjvILr6.mVxvn3Q587Rz8e', 'ruba@gm.com', 'teacher') RETURNING *;
    INSERT INTO auth (username, password, email, role) values ('zaid', '$2b$10$bU2t0RLijsvFs6hdfCDqT.HSFXCw2i.cjvILr6.mVxvn3Q587Rz8e', 'zaid@gm.com', 'student') RETURNING *;
    SELECT * FROM auth;
    DROP TABLE IF EXISTS students CASCADE;
    
    CREATE TABLE IF NOT EXISTS  students(
        id SERIAL PRIMARY KEY ,
        firstname VARCHAR (255) NOT NULL,
        lastname VARCHAR (255) NOT NULL,
        profilepic VARCHAR(255) DEFAULT 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Crystal_Clear_kdm_user_female.svg/1200px-Crystal_Clear_kdm_user_female.svg.png',
        interest VARCHAR(255),
        about TEXT,
        auth_id INT REFERENCES auth(id)
    );
    
    INSERT INTO students (firstname, lastname, profilepic, interest, auth_id) values ('zaid', 'alasfar','https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Crystal_Clear_kdm_user_female.svg/1200px-Crystal_Clear_kdm_user_female.svg.png','code' ,3) RETURNING *;
    SELECT students.firstname, auth.role FROM students JOIN auth ON students.auth_id = auth.id;
    
    DROP TABLE IF EXISTS teachers CASCADE;
    
    CREATE TABLE IF NOT EXISTS  teachers(
        id SERIAL PRIMARY KEY ,
        firstname VARCHAR (255) NOT NULL,
        lastname VARCHAR (255) NOT NULL,
        profilepic VARCHAR(255) DEFAULT 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Crystal_Clear_kdm_user_female.svg/1200px-Crystal_Clear_kdm_user_female.svg.png',
        about TEXT,
        auth_id INT REFERENCES auth(id) 
    );
    
    INSERT INTO teachers (firstname, lastname, auth_id) values ('ruba', 'banat', 2) RETURNING *;
    SELECT teachers.firstname, auth.role FROM teachers JOIN auth ON teachers.auth_id = auth.id;
    
    DROP TABLE IF EXISTS courses CASCADE;
    
    CREATE TABLE IF NOT EXISTS  courses(
        id SERIAL PRIMARY KEY ,
        name VARCHAR (255) NOT NULL,
        img VARCHAR (255) DEFAULT 'https://pc-tablet.com/wp-content/uploads/2020/11/stock-online-course.png',
        category VARCHAR(255),
        description TEXT ,
        classes TEXT
    );
    
    
    INSERT INTO courses (name,description,category,classes) values ('Cal','asddqweqweqwe','math', 'Class 1:');
    INSERT INTO courses (name,description,category,classes) values ('401','asddqweqweqwe','code', 'Class 1:');
    INSERT INTO courses (name,description,category,classes) values ('301','asddqweqweqwe','code', 'Class 1:');
    
    
    DROP TABLE IF EXISTS students_courses;
    
    CREATE TABLE IF NOT EXISTS  students_courses(
        id SERIAL PRIMARY KEY ,
        student_id INT REFERENCES students(id),
        course_id INT REFERENCES courses(id) ON DELETE CASCADE
    );
    
    INSERT INTO students_courses (student_id, course_id) values (1, 1) RETURNING *;
    INSERT INTO students_courses (student_id, course_id) values (1, 2) RETURNING *;
    SELECT * FROM students_courses JOIN students ON students_courses.student_id = students.id JOIN courses ON students_courses.course_id = courses.id;
    
    DROP TABLE IF EXISTS teachers_courses;
    
    CREATE TABLE IF NOT EXISTS  teachers_courses(
        id SERIAL PRIMARY KEY,
        teacher_id INT REFERENCES teachers(id),
        course_id INT REFERENCES courses(id) ON DELETE CASCADE
    );
    
    INSERT INTO teachers_courses (teacher_id, course_id) values (1, 2) RETURNING *;
    INSERT INTO teachers_courses (teacher_id, course_id) values (1, 3) RETURNING *;
    SELECT * FROM teachers_courses JOIN teachers ON teachers_courses.teacher_id = teachers.id JOIN courses ON teachers_courses.course_id = courses.id;
    
    DROP TABLE IF EXISTS course_comments;
    
    CREATE TABLE IF NOT EXISTS course_comments(
        id SERIAL PRIMARY KEY,
        student_id INT REFERENCES students(id),
        course_id INT REFERENCES courses(id) ON DELETE CASCADE,
        comment TEXT NOT NULL,
        time VARCHAR(255)
    );
    
    DROP TABLE IF EXISTS teachers_events;
    
    CREATE TABLE IF NOT EXISTS teachers_events(
        id SERIAL PRIMARY KEY,
        teacher_id INT REFERENCES teachers(id),
        event VARCHAR(255),
        time VARCHAR(255)
    );
    
    DROP TABLE IF EXISTS students_events;
    
    CREATE TABLE IF NOT EXISTS students_events(
        id SERIAL PRIMARY KEY,
        student_id INT REFERENCES students(id),
        event VARCHAR(255),
        time VARCHAR(255)
    );
    `);
  });

  afterAll(async () => {
    await client.query('DELETE FROM auth WHERE id=$1;', [id]);
    // await client.query(`DROP DATABASE IF EXISTS linkedlearntest;`);
    await client.end();
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
    aToken = response.body.token;
    expect(response.status).toEqual(200);
    expect(response.body.user.username).toBe(adminUser.username);
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
    expect(response.body.user.username).toBe(tUser.username);
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
    expect(response.body.user.username).toBe(sUser.username);
    expect(response.body.user.role).toBe('student');
  });

  it('should send an error if the username is incorrect on signin', async () => {
    const response = await request
      .post('/auth/signin')
      .set(
        'Authorization',
        'basic ' +
          new Buffer.from(`afna:${adminUser.password}`, 'utf8').toString(
            'base64'
          )
      );
    expect(response.status).toEqual(403);
    expect(response.text).toEqual('Invalid Login');
  });

  it('should send an error if the password is incorrect on signin', async () => {
    const response = await request
      .post('/auth/signin')
      .set(
        'Authorization',
        'basic ' +
          new Buffer.from(`${adminUser.username}:12345`, 'utf8').toString(
            'base64'
          )
      );
    expect(response.status).toEqual(403);
    expect(response.text).toEqual('Invalid Login');
  });

  it('should send an error if the headers are not properly sent on signin', async () => {
    const response = await request.post('/auth/signin');
    expect(response.status).toEqual(403);
    expect(response.text).toEqual('Invalid Login');
  });

  it('can access admin routes with admin token', async () => {
    const response = await request
      .get('/auth/users')
      .set('Authorization', 'bearer ' + aToken);
    expect(response.status).toEqual(200);
  });

  it('cannot access admin routes with non admin token', async () => {
    const response = await request
      .get('/auth/users')
      .set('Authorization', 'bearer ' + tToken);
    expect(response.status).toEqual(500);
    expect(JSON.parse(response.error.text).message).toBe('Access Denied');
  });

  it('can access teachers routes with teacher token', async () => {
    const response = await request
      .get('/auth/teacher')
      .set('Authorization', 'bearer ' + tToken);
    expect(response.status).toEqual(200);
  });

  it('can access students routes with student token', async () => {
    const response = await request
      .get('/auth/student')
      .set('Authorization', 'bearer ' + sToken);
    expect(response.status).toEqual(200);
  });

  it('cannot access confidential routes with non valid token', async () => {
    const response = await request
      .get('/auth/student')
      .set('Authorization', 'bearer ' + 'notvalidtoken');
    expect(response.status).toEqual(500);
    expect(JSON.parse(response.error.text).message).toBe('Invalid Login');
  });

  it('cannot access confidential routes without token', async () => {
    const response = await request.get('/auth/teacher');
    expect(response.status).toEqual(500);
    expect(JSON.parse(response.error.text).message).toBe('Invalid Login');
  });

  it('should create a new teacher user on POST /signup', async () => {
    let newUser = {
      username: 'bashar',
      password: '123456',
      email: 'bashar@gm.com',
    };
    const response = await request.post('/auth/signup').send(newUser);
    expect(response.status).toEqual(201);
    expect(response.body.user.username).toEqual(newUser.username);
    id = response.body.user.id;
  });

  it('should not create a user if username exists', async () => {
    let newUser = {
      username: 'bashar',
      password: '123456',
      email: 'newbashar@gm.com',
      role: 'student',
    };
    const response = await request.post('/auth/signup').send(newUser);
    expect(response.status).toEqual(200);
    expect(response.text).toEqual(
      `username ${newUser.username} already exists, sign in instead`
    );
  });

  it('should not create a user if email exists', async () => {
    let newUser = {
      username: 'newbashar',
      password: '123456',
      email: 'bashar@gm.com',
      role: 'student',
    };
    const response = await request.post('/auth/signup').send(newUser);
    expect(response.status).toEqual(200);
    expect(response.text).toEqual(
      `email ${newUser.email} already exists, sign in instead`
    );
  });
});
