import assert from 'assert';
import request from 'supertest';
import app from '../../src/app.js';

describe('tost Controller', function () {
    it('GET /v1/tost/tost', async function () {
        const res = await request(app).get('/v1/tost/tost').send().expect(200);
        assert(res.text, 'tost');
    });
});
