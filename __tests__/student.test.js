'use strict';

const client = require('../src/db.js');
const superTest = require('supertest');
const { app } = require('../src/server');
const request = superTest(app);



xdescribe('==================Students Routes==================', () => {
    beforeAll(async () => {
        await client.connect();
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
        await client.end();
    });
    it('can access student profile ', async () => {
        const response = await request.get('/student/profile')
        expect(response.status).toEqual(200);
    });
    it('can update student profile ', async () => {
        const response = await request.patch('/student/profile/1').send({
            firstname: 'ruba',
            lastname: 'banat'
        })
        expect(response.body.firstname).toEqual('ruba')
        expect(response.status).toEqual(200);
    });
    it('can get all student courses ', async () => {
        const response = await request.get('/student/courses')
        expect(response.status).toEqual(200);
    });
    it('can get student course details ', async () => {
        const response = await request.get('/student/courses/1')
        // console.log(response.body);
        expect(response.body.name).toEqual('Cal');
        expect(response.status).toEqual(200);
    });
    it('can add course to profile ', async () => {
        const response = await request.post('/student/courses').send({course_id: 2})
        expect(response.status).toEqual(200);
    });
    it('can delete course from profile ', async () => {
        const response = await request.delete('/student/courses/1')
        expect(response.status).toEqual(200);
    });

})
