let mongoose = require("mongoose");
let chai = require('chai');
let chaiHttp = require('chai-http');
let chaiSubset = require('chai-subset');
let should = chai.should();
let expect = chai.expect;

import UserModel from '../models/user';

chai.use(chaiHttp);
chai.use(chaiSubset);

let verification_token = '';

export default function TestExpressCoreUsersEmailVerification() {
    describe('User email verification endpoint', () => {
        describe('POST /users/verify_email', () => {
            it('must return 404 on get request', (done) => {
                chai.request(server)
                    .get('/api/basic/users/verify_email')
                    .send()
                    .end((err, res) => {
                        res.should.have.status(404);
                        res.body.should.have.property('success').eq(false);
                        res.body.should.have.property('type').eq('endpoint');
                        done();
                    });
            });

            it('user data must be correct', function(done) {
                UserModel.findOne({ 'email': 'test@sensorlab.io'}).exec().then((user) => {
                    user._id.should.exist;
                    user.isEmailVerified.should.equal(false);
                    user.verificationCode.should.exist;
                    verification_token = user.verificationCode;
                    done();
                });
            });

            it('must return error if no token is provided', (done) => {
                chai.request(server)
                    .post('/api/basic/users/verify_email')
                    .send()
                    .end((err, res) => {
                        res.should.have.status(422);
                        res.body.should.have.property('success').eq(false);
                        res.body.should.have.property('code').eq(422);
                        res.body.should.have.property('errors');
                        res.body.errors.should.be.a('array');
                        res.body.errors.should.containSubset([{code: 1, param: 'verification_token'}]);
                        done();
                    });
            });

            it('must return error if token is incorrect', (done) => {
                var data = {'verification_token': 'testtoken'};
                chai.request(server)
                    .post('/api/basic/users/verify_email')
                    .send(data)
                    .end((err, res) => {
                        res.should.have.status(404);
                        res.body.should.have.property('code').eq(404);
                        res.body.should.have.property('message');
                        res.body.should.have.property('success').eq(false);
                        res.body.should.have.property('type').eq('object');
                        res.body.should.have.property('object_type').eq('verification_token');
                        done();
                    });
            });

            it('must return success for correct token', (done) => {
                var data = {'verification_token': verification_token};
                chai.request(server)
                    .post('/api/basic/users/verify_email')
                    .send(data)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('success').eq(true);
                        res.body.should.have.property('code').eq(100);
                        res.body.should.have.property('message');
                        done();
                    });
            });

            it('it must return an error now since token was used', (done) => {
                var data = {'verification_token': verification_token};
                chai.request(server)
                    .post('/api/basic/users/verify_email')
                    .send(data)
                    .end((err, res) => {
                        res.should.have.status(404);
                        res.body.should.have.property('code').eq(404);
                        res.body.should.have.property('message');
                        res.body.should.have.property('success').eq(false);
                        res.body.should.have.property('type').eq('object');
                        res.body.should.have.property('object_type').eq('verification_token');
                        done();
                    });
            });

            it('user data must be correct', function(done) {
                UserModel.findOne({ 'email': 'test@sensorlab.io'}).exec().then((user) => {
                    user._id.should.exist;
                    user.isEmailVerified.should.equal(true);
                    user.verificationCode.should.exist;
                    done();
                });
            });

        });
    });
}