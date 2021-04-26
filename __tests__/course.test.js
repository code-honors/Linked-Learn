'use strict';

const client = require('../src/db.js');
const superTest = require('supertest');
const { app } = require('../src/server');
const request = superTest(app);



xdescribe('==================Students Routes==================', () => {
    beforeAll(async () => {
        await client.connect();
    });

    afterAll(async () => {
        await client.end();
    });

    it('can get all courses ', async () => {
        const response = await request.get('/courses');
        expect(response.status).toEqual(200);
    });

    it('can get course by ID ', async () => {
        const response = await request.get('/courses/2');
        // console.log(response.body);
        expect(response.status).toEqual(200);
    });

    it('can add comment to course', async () => {
        const response = await request.post('/courses/2').send({ comment: 'bad teacher' });
        expect(response.status).toEqual(200);
    });
})