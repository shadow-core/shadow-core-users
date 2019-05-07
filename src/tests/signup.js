let mongoose = require("mongoose");
let chai = require('chai');
let chaiHttp = require('chai-http');
let chaiSubset = require('chai-subset');
let should = chai.should();
let expect = chai.expect;

import UserModel from '../models/user';

chai.use(chaiHttp);
chai.use(chaiSubset);

let token = '';

let accountId = null;
let userId = null;

export default function ExpressCoreUsersTests_Signup(server) {
    describe('User signup endpoint', () => {
        describe('GET /users/signup', () => {
            it('must return 404 on get request', (done) => {
                chai.request(server)
                    .get('/api/v1/users/signup')
                    .send()
                    .end((err, res) => {
                        res.should.have.status(404);
                        res.body.should.have.property('success').eq(false);
                        res.body.should.have.property('type').eq('endpoint');
                        done();
                    });
            });

            /*
            it('should return error if there is no email', (done) => {
                var data = {};
                chai.request(server)
                    .post('/api/v1/users/signup')
                    .send(data)
                    .end((err, res) => {
                        res.should.have.status(422);
                        res.body.should.have.property('success').eq(false);
                        res.body.should.have.property('code').eq(422);
                        res.body.should.have.property('errors');
                        res.body.errors.should.be.a('array');
                        res.body.errors.should.containSubset([{code: 1, param: 'email'}]);
                        res.body.errors.should.containSubset([{code: 2, param: 'email'}]);
                        res.body.errors.should.containSubset([{code: 4, param: 'password'}]);
                        res.body.errors.should.containSubset([{code: 5, param: 'password_check'}]);
                        done();
                    });
            });

            it('should return error if email in wrong format', (done) => {
                var data = {'email': 'test'};
                chai.request(server)
                    .post('/api/v1/users/signup')
                    .send(data)
                    .end((err, res) => {
                        res.should.have.status(422);
                        res.body.should.have.property('success').eq(false);
                        res.body.should.have.property('code').eq(422);
                        res.body.should.have.property('errors');
                        res.body.errors.should.be.a('array');
                        res.body.errors.should.containSubset([{code: 2, param: 'email'}]);
                        res.body.errors.should.containSubset([{code: 4, param: 'password'}]);
                        res.body.errors.should.containSubset([{code: 5, param: 'password_check'}]);
                        done();
                    });
            });

            it('should return error if none of passwords is provided', (done) => {
                var data = {'email': 'test@sensorlab.io'};
                chai.request(server)
                    .post('/api/v1/users/signup')
                    .send(data)
                    .end((err, res) => {
                        res.should.have.status(422);
                        res.body.should.have.property('success').eq(false);
                        res.body.should.have.property('code').eq(422);
                        res.body.should.have.property('errors');
                        res.body.errors.should.be.a('array');
                        res.body.errors.should.containSubset([{code: 4, param: 'password'}]);
                        res.body.errors.should.containSubset([{code: 5, param: 'password_check'}]);
                        done();
                    });
            });

            it('should return error if is password only provided', (done) => {
                var data = {'email': 'test@sensorlab.io', 'password': 'test'};
                chai.request(server)
                    .post('/api/v1/users/signup')
                    .send(data)
                    .end((err, res) => {
                        res.should.have.status(422);
                        res.body.should.have.property('success').eq(false);
                        res.body.should.have.property('code').eq(422);
                        res.body.should.have.property('errors');
                        res.body.errors.should.be.a('array');
                        res.body.errors.should.containSubset([{code: 5, param: 'password_check'}]);
                        res.body.errors.should.containSubset([{code: 6, param: 'password_check'}]);
                        done();
                    });
            });

            it('should return error if only password check provided', (done) => {
                var data = {'email': 'test@sensorlab.io', 'password_check': 'test'};
                chai.request(server)
                    .post('/api/v1/users/signup')
                    .send(data)
                    .end((err, res) => {
                        res.should.have.status(422);
                        res.body.should.have.property('success').eq(false);
                        res.body.should.have.property('code').eq(422);
                        res.body.should.have.property('errors');
                        res.body.errors.should.be.a('array');
                        res.body.errors.should.containSubset([{code: 4, param: 'password'}]);
                        res.body.errors.should.containSubset([{code: 6, param: 'password_check'}]);
                        done();
                    });
            });

            it('should return error passwords differ', (done) => {
                var data = {'email': 'test@sensorlab.io', 'password': 'test', 'password_check': 'password'};
                chai.request(server)
                    .post('/api/v1/users/signup')
                    .send(data)
                    .end((err, res) => {
                        res.should.have.status(422);
                        res.body.should.have.property('success').eq(false);
                        res.body.should.have.property('code').eq(422);
                        res.body.should.have.property('errors');
                        res.body.errors.should.be.a('array');
                        res.body.errors.should.containSubset([{code: 6, param: 'password_check'}]);
                        done();
                    });
            });

            it('should return error passwords differ only by uppercase', (done) => {
                var data = {'email': 'test@sensorlab.io', 'password': 'test', 'password_check': 'Test'};
                chai.request(server)
                    .post('/api/v1/users/signup')
                    .send(data)
                    .end((err, res) => {
                        res.should.have.status(422);
                        res.body.should.have.property('success').eq(false);
                        res.body.should.have.property('code').eq(422);
                        res.body.should.have.property('errors');
                        res.body.errors.should.be.a('array');
                        res.body.errors.should.containSubset([{code: 6, param: 'password_check'}]);
                        done();
                    });
            });

            it('should return success if everything is correct', (done) => {
                var data = {'email': 'test@sensorlab.io', 'password': 'test', 'password_check': 'test'};
                chai.request(server)
                    .post('/api/v1/users/signup')
                    .send(data)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('success').eq(true);
                        res.body.should.have.property('code').eq(100);
                        res.body.should.have.property('message');
                        done();
                    });
            });

            it('user data must be correct', function(done) {
                UserModel.findOne({ 'email': 'test@sensorlab.io'}).exec().then((user) => {
                    user._id.should.exist;
                    user.email.should.exist.eq('test@sensorlab.io');
                    user.isEmailVerified.should.exist.eq(false);
                    user.resetPasswordIsRequested.should.exist.eq(false);
                    user.resetPasswordRequestsAmount.should.exist.eq(0);
                    user.verificationCode.should.exist;
                    userId = user._id.toString();
                    done();
                });
            });

            it('should return error because user with this email already exists', (done) => {
                var data = {'email': 'test@sensorlab.io', 'password': 'test', 'password_check': 'test'};
                chai.request(server)
                    .post('/api/v1/users/signup')
                    .send(data)
                    .end((err, res) => {
                        res.should.have.status(422);
                        res.body.should.have.property('success').eq(false);
                        res.body.should.have.property('code').eq(422);
                        res.body.should.have.property('errors');
                        res.body.errors.should.be.a('array');
                        res.body.errors.should.containSubset([{code: 3, param: 'email'}]);
                        done();
                    });
            });
             */

        });

    });
}