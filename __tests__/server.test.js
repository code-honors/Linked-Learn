'use strict';

const pg = require('pg');
const client = new pg.Client("postgres://bashar:9971011997@localhost:5432/linkedlearntest");
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
      it('handle bad method', async () => {
        const response = await request.post('/*');
        // expect(response.request.method).toBe('POST');
        expect(response.status).toEqual(404);
      });
});