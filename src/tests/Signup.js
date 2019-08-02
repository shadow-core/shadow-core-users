const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiSubset = require('chai-subset');

const should = chai.should();
const { expect } = chai;

chai.use(chaiHttp);
chai.use(chaiSubset);

export default function Signup(server, apiPrefix, models, options = {}) {
  if (options.noVerif === undefined) options.noVerif = false;

  describe('User signup endpoint', () => {
    describe('GET /users/signup', () => {
      it('must return 404 on get request', (done) => {
        chai.request(server)
          .get(`${apiPrefix}/users/signup`)
          .send()
          .end((err, res) => {
            res.should.have.status(404);
            res.body.should.have.property('success').eq(false);
            res.body.should.have.property('type').eq('endpoint');
            done();
          });
      });

      it('should return error if there is no email', (done) => {
        const data = {};
        chai.request(server)
          .post(`${apiPrefix}/users/signup`)
          .send(data)
          .end((err, res) => {
            res.should.have.status(422);
            res.body.should.have.property('success').eq(false);
            res.body.should.have.property('code').eq(422);
            res.body.should.have.property('errors');
            res.body.errors.should.be.a('array');
            res.body.errors.should.containSubset([{ code: 1, param: 'email' }]);
            res.body.errors.should.containSubset([{ code: 2, param: 'email' }]);
            res.body.errors.should.not.containSubset([{ code: 3, param: 'email' }]);
            res.body.errors.should.containSubset([{ code: 4, param: 'password' }]);
            res.body.errors.should.containSubset([{ code: 5, param: 'passwordCheck' }]);
            res.body.errors.should.not.containSubset([{ code: 6, param: 'passwordCheck' }]);
            done();
          });
      });

      it('should return error if email in wrong format', (done) => {
        const data = { email: 'test' };
        chai.request(server)
          .post(`${apiPrefix}/users/signup`)
          .send(data)
          .end((err, res) => {
            res.should.have.status(422);
            res.body.should.have.property('success').eq(false);
            res.body.should.have.property('code').eq(422);
            res.body.should.have.property('errors');
            res.body.errors.should.be.a('array');
            res.body.errors.should.not.containSubset([{ code: 1, param: 'email' }]);
            res.body.errors.should.containSubset([{ code: 2, param: 'email' }]);
            res.body.errors.should.not.containSubset([{ code: 3, param: 'email' }]);
            res.body.errors.should.containSubset([{ code: 4, param: 'password' }]);
            res.body.errors.should.containSubset([{ code: 5, param: 'passwordCheck' }]);
            res.body.errors.should.not.containSubset([{ code: 6, param: 'passwordCheck' }]);
            done();
          });
      });

      it('should return error if none of passwords is provided', (done) => {
        const data = { email: 'test@test.com' };
        chai.request(server)
          .post(`${apiPrefix}/users/signup`)
          .send(data)
          .end((err, res) => {
            res.should.have.status(422);
            res.body.should.have.property('success').eq(false);
            res.body.should.have.property('code').eq(422);
            res.body.should.have.property('errors');
            res.body.errors.should.be.a('array');
            res.body.errors.should.not.containSubset([{ code: 1, param: 'email' }]);
            res.body.errors.should.not.containSubset([{ code: 2, param: 'email' }]);
            res.body.errors.should.not.containSubset([{ code: 3, param: 'email' }]);
            res.body.errors.should.containSubset([{ code: 4, param: 'password' }]);
            res.body.errors.should.containSubset([{ code: 5, param: 'passwordCheck' }]);
            res.body.errors.should.not.containSubset([{ code: 6, param: 'passwordCheck' }]);
            done();
          });
      });

      it('should return error if is password only provided', (done) => {
        const data = { email: 'test@test.com', password: 'test' };
        chai.request(server)
          .post(`${apiPrefix}/users/signup`)
          .send(data)
          .end((err, res) => {
            res.should.have.status(422);
            res.body.should.have.property('success').eq(false);
            res.body.should.have.property('code').eq(422);
            res.body.should.have.property('errors');
            res.body.errors.should.be.a('array');
            res.body.errors.should.not.containSubset([{ code: 1, param: 'email' }]);
            res.body.errors.should.not.containSubset([{ code: 2, param: 'email' }]);
            res.body.errors.should.not.containSubset([{ code: 3, param: 'email' }]);
            res.body.errors.should.not.containSubset([{ code: 4, param: 'password' }]);
            res.body.errors.should.containSubset([{ code: 5, param: 'passwordCheck' }]);
            res.body.errors.should.not.containSubset([{ code: 6, param: 'passwordCheck' }]);
            done();
          });
      });

      it('should return error if only password check provided', (done) => {
        const data = { email: 'test@test.com', passwordCheck: 'test' };
        chai.request(server)
          .post(`${apiPrefix}/users/signup`)
          .send(data)
          .end((err, res) => {
            res.should.have.status(422);
            res.body.should.have.property('success').eq(false);
            res.body.should.have.property('code').eq(422);
            res.body.should.have.property('errors');
            res.body.errors.should.be.a('array');
            res.body.errors.should.not.containSubset([{ code: 1, param: 'email' }]);
            res.body.errors.should.not.containSubset([{ code: 2, param: 'email' }]);
            res.body.errors.should.not.containSubset([{ code: 3, param: 'email' }]);
            res.body.errors.should.containSubset([{ code: 4, param: 'password' }]);
            res.body.errors.should.not.containSubset([{ code: 5, param: 'passwordCheck' }]);
            res.body.errors.should.not.containSubset([{ code: 6, param: 'passwordCheck' }]);
            done();
          });
      });

      it('should return error passwords differ', (done) => {
        const data = { email: 'test@test.com', password: 'test', passwordCheck: 'password' };
        chai.request(server)
          .post(`${apiPrefix}/users/signup`)
          .send(data)
          .end((err, res) => {
            res.should.have.status(422);
            res.body.should.have.property('success').eq(false);
            res.body.should.have.property('code').eq(422);
            res.body.should.have.property('errors');
            res.body.errors.should.be.a('array');
            res.body.errors.should.not.containSubset([{ code: 1, param: 'email' }]);
            res.body.errors.should.not.containSubset([{ code: 2, param: 'email' }]);
            res.body.errors.should.not.containSubset([{ code: 3, param: 'email' }]);
            res.body.errors.should.not.containSubset([{ code: 4, param: 'password' }]);
            res.body.errors.should.not.containSubset([{ code: 5, param: 'passwordCheck' }]);
            res.body.errors.should.containSubset([{ code: 6, param: 'passwordCheck' }]);
            done();
          });
      });

      it('should return error passwords differ only by uppercase', (done) => {
        const data = { email: 'test@test.com', password: 'test', passwordCheck: 'Test' };
        chai.request(server)
          .post(`${apiPrefix}/users/signup`)
          .send(data)
          .end((err, res) => {
            res.should.have.status(422);
            res.body.should.have.property('success').eq(false);
            res.body.should.have.property('code').eq(422);
            res.body.should.have.property('errors');
            res.body.errors.should.be.a('array');
            res.body.errors.should.not.containSubset([{ code: 1, param: 'email' }]);
            res.body.errors.should.not.containSubset([{ code: 2, param: 'email' }]);
            res.body.errors.should.not.containSubset([{ code: 3, param: 'email' }]);
            res.body.errors.should.not.containSubset([{ code: 4, param: 'password' }]);
            res.body.errors.should.not.containSubset([{ code: 5, param: 'passwordCheck' }]);
            res.body.errors.should.containSubset([{ code: 6, param: 'passwordCheck' }]);
            done();
          });
      });

      it('should return success if everything is correct', (done) => {
        const data = { email: 'test@test.com', password: 'test', passwordCheck: 'test' };
        chai.request(server)
          .post(`${apiPrefix}/users/signup`)
          .send(data)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('success').eq(true);
            res.body.should.have.property('code').eq(100);
            res.body.should.have.property('message');
            done();
          });
      });

      it('user data must be correct', (done) => {
        models.User.findOne({ email: 'test@test.com' }).exec().then((user) => {
          user._id.should.exist;
          user.email.should.exist.eq('test@test.com');
          if (options.noVerif) {
            user.isEmailVerified.should.exist.eq(true);
          } else {
            user.isEmailVerified.should.exist.eq(false);
          }
          user.resetPasswordIsRequested.should.exist.eq(false);
          user.resetPasswordRequestsAmount.should.exist.eq(0);
          user.verificationCode.should.exist;
          done();
        });
      });

      it('should return success if everything is correct - check trim()', (done) => {
        const data = { email: '     test2@test.com      ', password: 'test', passwordCheck: 'test' };
        chai.request(server)
          .post(`${apiPrefix}/users/signup`)
          .send(data)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('success').eq(true);
            res.body.should.have.property('code').eq(100);
            res.body.should.have.property('message');
            done();
          });
      });

      it('user data must be correct', (done) => {
        models.User.findOne({ email: 'test2@test.com' }).exec().then((user) => {
          user._id.should.exist;
          user.email.should.exist.eq('test2@test.com');
          if (options.noVerif) {
            user.isEmailVerified.should.exist.eq(true);
          } else {
            user.isEmailVerified.should.exist.eq(false);
          }
          user.resetPasswordIsRequested.should.exist.eq(false);
          user.resetPasswordRequestsAmount.should.exist.eq(0);
          user.verificationCode.should.exist;
          done();
        });
      });


      it('should return error because user with this email already exists', (done) => {
        const data = { email: 'test@test.com', password: 'test', passwordCheck: 'test' };
        chai.request(server)
          .post(`${apiPrefix}/users/signup`)
          .send(data)
          .end((err, res) => {
            res.should.have.status(422);
            res.body.should.have.property('success').eq(false);
            res.body.should.have.property('code').eq(422);
            res.body.should.have.property('errors');
            res.body.errors.should.be.a('array');
            res.body.errors.should.not.containSubset([{ code: 1, param: 'email' }]);
            res.body.errors.should.not.containSubset([{ code: 2, param: 'email' }]);
            res.body.errors.should.containSubset([{ code: 3, param: 'email' }]);
            res.body.errors.should.not.containSubset([{ code: 4, param: 'password' }]);
            res.body.errors.should.not.containSubset([{ code: 5, param: 'passwordCheck' }]);
            res.body.errors.should.not.containSubset([{ code: 6, param: 'passwordCheck' }]);
            done();
          });
      });
    });
  });
}
