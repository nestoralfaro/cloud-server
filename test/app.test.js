/**
 * @jest-environment node
 */

const fs = require('fs').promises;
const supertest = require('supertest');
const { describe, it, expect, beforeAll } = require('@jest/globals');

const config = require('../lib/config');
config.cloudDir = __dirname + '/files';
const app = require('../lib/app');

const dataDir = __dirname + '/data';
let data;

beforeAll(async () => {
    await fs.mkdir(config.cloudDir, { recursive: true });
    data = await fs.readFile(dataDir + '/hat.txt');
})

describe('Upload', () => {
    it('should upload text file', async () => {
        await supertest(app)
            .post('/cloud/')
            .field('command', 'upload')
            .attach('file', __dirname + '/data/hat.txt')
            .expect(303)
            .expect('Location', '.');

        let file_data = await fs.readFile(config.cloudDir + '/hat.txt');
        expect(file_data).toStrictEqual(data);
    });
});

console.log("for view: ");
console.log(dataDir + '/hat.txt', config.cloudDir + '/hat2.txt');

describe('View', () => {
    it('should allow you to view files', async () => {
        await fs.cp(dataDir + '/hat.txt', config.cloudDir + '/hat2.txt');
        let res = await supertest(app)
            .get('/cloud/hat2.txt')
            .expect(200)
            .expect('Content-Type', /^text\/plain/);

        let disp = res.get('Content-Disposition');
        if (disp) {
            expect(disp).toMatch(/^inline/);
        }
        expect(res.text).toStrictEqual(String(data));
    });

    it('should not allow you to have .. in your path', async () => {
        await supertest(app)
            .get('/cloud/../app.test.js')
            .expect(404);
    });
});

describe('Download', () => {
    it('should allow you to download files', async () => {
        await fs.cp(dataDir + '/hat.txt', config.cloudDir + '/hat3.txt');
        let res = await supertest(app)
            .get('/cloud/hat3.txt?download')
            .expect(200)
            .expect('Content-Type', /^text\/plain/)
            .expect('Content-Disposition', 'attachment; filename="hat3.txt"');
        expect(res.text).toStrictEqual(String(data));
    });
});