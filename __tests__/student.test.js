'use strict';

const client = require('../src/db.js');
const superTest = require('supertest');
const { app } = require('../src/server');
const request = superTest(app);



xdescribe('==================STUDENTS==================', () => {
    beforeAll(async () => {
        await client.connect();
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
        const response = await request.post('/student/courses').send({ course_id: 2 })
        expect(response.status).toEqual(200);
    });
    it('can delete course from profile ', async () => {
        const response = await request.delete('/student/courses/1');
        expect(response.text).toBe('Deleted');
        expect(response.status).toEqual(200);
    });

})
