'use strict';

const superTest = require('supertest');
const {app} = require('../src/server');
const request = superTest(app);

describe('==================SERVER==================', () => {
    it('handle working routes', async () => {
        const response = await request.get('/');
        expect(response.status).toEqual(200);
        // expect(response.text).toEqual('Home Page');
      });
      test('handle invalid routes', async () => {
        const response = await request.get('/whatever');
        expect(response.status).toEqual(404);
      });
});