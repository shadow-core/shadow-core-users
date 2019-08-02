const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiSubset = require('chai-subset');

const should = chai.should();
const { expect } = chai;

chai.use(chaiHttp);
chai.use(chaiSubset);

export default function EmailVerification(app, options = {}) {
  let verificationToken = '';
  let verificationToken2 = '';

  describe('User email verification endpoint', () => {
    describe('POST /users/verify_email', () => {
      it('must return 404 on get request', (done) => {
        chai.request(app.server)
          .get(`${options.apiPrefix}/users/verify_email`)
          .send()
          .end((err, res) => {
            res.should.have.status(404);
            res.body.should.have.property('success').eq(false);
            res.body.should.have.property('type').eq('endpoint');
            done();
          });
      });

      it('user data must be correct', (done) => {
        app.models.User.findOne({ email: 'test@test.com' }).exec().then((user) => {
          user._id.should.exist;
          user.isEmailVerified.should.equal(false);
          user.verificationCode.should.exist;
          verificationToken = user.verificationCode;
          done();
        });
      });

      it('must return error if no token is provided', (done) => {
        chai.request(app.server)
          .post(`${options.apiPrefix}/users/verify_email`)
          .send()
          .end((err, res) => {
            res.should.have.status(422);
            res.body.should.have.property('success').eq(false);
            res.body.should.have.property('code').eq(422);
            res.body.should.have.property('errors');
            res.body.errors.should.be.a('array');
            res.body.errors.should.containSubset([{ code: 1, param: 'verificationToken' }]);
            done();
          });
      });

      it('must return error if token is incorrect', (done) => {
        const data = { verificationToken: 'testtoken' };
        chai.request(app.server)
          .post(`${options.apiPrefix}/users/verify_email`)
          .send(data)
          .end((err, res) => {
            res.should.have.status(404);
            res.body.should.have.property('code').eq(404);
            res.body.should.have.property('message');
            res.body.should.have.property('success').eq(false);
            res.body.should.have.property('type').eq('object');
            res.body.should.have.property('objectType').eq('verificationToken');
            done();
          });
      });

      it('must return success for correct token', (done) => {
        const data = { verificationToken };
        chai.request(app.server)
          .post(`${options.apiPrefix}/users/verify_email`)
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
        app.models.User.findOne({ email: 'test2@test.com' }).exec().then((user) => {
          user._id.should.exist;
          user.isEmailVerified.should.equal(false);
          user.verificationCode.should.exist;
          verificationToken2 = user.verificationCode;
          done();
        });
      });

      it('must return success for correct token - check trim()', (done) => {
        const data = { verificationToken: `   ${verificationToken2}    ` };
        chai.request(app.server)
          .post(`${options.apiPrefix}/users/verify_email`)
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
        const data = { verificationToken };
        chai.request(app.server)
          .post(`${options.apiPrefix}/users/verify_email`)
          .send(data)
          .end((err, res) => {
            res.should.have.status(404);
            res.body.should.have.property('code').eq(404);
            res.body.should.have.property('message');
            res.body.should.have.property('success').eq(false);
            res.body.should.have.property('type').eq('object');
            res.body.should.have.property('objectType').eq('verificationToken');
            done();
          });
      });

      it('user data must be correct', (done) => {
        app.models.User.findOne({ email: 'test@test.com' }).exec().then((user) => {
          user._id.should.exist;
          user.isEmailVerified.should.equal(true);
          user.verificationCode.should.exist;
          done();
        });
      });
    });
  });
}
