'use strict';

const client = require('../src/db.js');
const superTest = require('supertest');
const { app } = require('../src/server');
const { response } = require('express');
const request = superTest(app);



xdescribe('==================teacher Routes==================', () => {
    beforeAll(async () => {
        await client.connect();
    });

    afterAll(async () => {
        await client.end();
    });
    it('can access teacher profile ', async () => {
        const response = await request.get('/teacher/profile')
        expect(response.status).toEqual(200);
    });
    it('can update teacher profile ', async () => {
        const response = await request.patch('/teacher/profile/1').send({
            firstname: 'zaid',
            lastname: 'alasfar'
        })
        // console.log('_________________________', response.body);
        expect(response.body.firstname).toEqual('zaid');
        expect(response.status).toEqual(200);
    });
    it('can get all teacher courses ', async () => {
        const response = await request.get('/teacher/courses')
        expect(response.status).toEqual(200);
    });
    it('can get teacher course details ', async () => {
        const response = await request.get('/teacher/courses/2');
        console.log(response.body);
        expect(response.body.name).toEqual('401');
        expect(response.status).toEqual(200);
    });
    it('can add course to profile ', async () => {
        const response = await request.post('/teacher/courses').send({
            name: '201',
            description: 'JavaScript',
            classes: 'ClassOne',
            category: 'Coding'
        })
        console.log(response.body);
        expect(response.status).toEqual(200);

    });
    it('can delete course from profile ', async () => {
        const response = await request.delete('/teacher/courses/1');
        expect(response.text).toBe('Deleted');
        expect(response.status).toEqual(200);
    });

})
