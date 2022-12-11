import request from 'supertest';

import server from './server';

describe('GET /', () => {
    it('should return 200 OK', (done) => {
        request(server).get('/')
            .expect(200).set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });
});


// get all products
describe('GET /api/v1/products', () => {
    it('should return 401 not authorized', (done) => {
        request(server)
            .get('/api/v1/products')
            .set('Accept', 'application/json')
            .expect(401)
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });
});


// user signup using async await , import the sendEmail function from the mailer.ts file
describe('POST /api/v1/users/register', () => {
    it('should return 201 OK', (done) => {
        request(server)
            .post('/api/v1/users/register')
            .send({
                name: 'Abayomi Oguns',
                email: 'abayomiogunnusi@gmail.com',
                password: '123456',
            })  
            .set('Accept', 'application/json')
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });
});




describe('POST /api/v1/users/login', () => {
    it('should return 400 OK', (done) => {
        request(server)
            .post('/api/v1/users/login')
            .send({
                email: 'abayomiogunnusi@gmail.com',
                password: '123456', // we passed plain text password here instead of hashed password
            })
            .set('Accept', 'application/json')
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });
});


// get all products category
describe('GET /api/v1/products/category', () => {
    it('should return 200 OK', (done) => {
        request(server)
            .get('/api/v1/products/category')
            .set('Accept', 'application/json')
            .expect(200)
            // expect array of objects
            .expect('Content-Type', /json/)
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });
});




