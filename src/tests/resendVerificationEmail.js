const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiSubset = require('chai-subset');

const should = chai.should();
const { expect } = chai;

chai.use(chaiHttp);
chai.use(chaiSubset);

export default function ExpressCoreUsersTestsResendVerificationEmail(server) {
  describe('Resend verification email endpoint', () => {
    describe('GET /users/verify_email/resend', () => {
      it('must return 404 on get request', (done) => {
        chai.request(server)
          .get('/api/basic/users/verify_email/resend')
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
          .post('/api/basic/users/verify_email/resend')
          .send(data)
          .end((err, res) => {
            res.should.have.status(422);
            res.body.should.have.property('success').eq(false);
            res.body.should.have.property('code').eq(422);
            res.body.should.have.property('errors');
            res.body.errors.should.be.a('array');
            res.body.errors.should.containSubset([{ code: 1, param: 'email' }]);
            res.body.errors.should.containSubset([{ code: 2, param: 'email' }]);
            res.body.errors.should.containSubset([{ code: 3, param: 'email' }]);
            done();
          });
      });

      it('should return error if email in wrong format', (done) => {
        const data = { email: 'admin' };
        chai.request(server)
          .post('/api/basic/users/verify_email/resend')
          .send(data)
          .end((err, res) => {
            res.should.have.status(422);
            res.body.should.have.property('success').eq(false);
            res.body.should.have.property('code').eq(422);
            res.body.should.have.property('errors');
            res.body.errors.should.be.a('array');
            res.body.errors.should.containSubset([{ code: 2, param: 'email' }]);
            res.body.errors.should.containSubset([{ code: 3, param: 'email' }]);
            done();
          });
      });

      it('should return error if there is not such user in the database', (done) => {
        const data = { email: 'admin+testtestestest@devilmaydie.name' };
        chai.request(server)
          .post('/api/basic/users/verify_email/resend')
          .send(data)
          .end((err, res) => {
            res.should.have.status(422);
            res.body.should.have.property('success').eq(false);
            res.body.should.have.property('code').eq(422);
            res.body.should.have.property('errors');
            res.body.errors.should.be.a('array');
            res.body.errors.should.containSubset([{ code: 3, param: 'email' }]);
            done();
          });
      });

      it('should return error email is already verified', (done) => {
        const data = { email: 'test@sensorlab.io' };
        chai.request(server)
          .post('/api/basic/users/verify_email/resend')
          .send(data)
          .end((err, res) => {
            res.should.have.status(422);
            res.body.should.have.property('success').eq(false);
            res.body.should.have.property('code').eq(422);
            res.body.should.have.property('errors');
            res.body.errors.should.be.a('array');
            res.body.errors.should.containSubset([{ code: 4, param: 'email' }]);
            done();
          });
      });

      it('should return success if everything is correct', (done) => {
        const data = { email: 'admin+verify@devilmaydie.name', password: 'admin', password_check: 'admin' };
        chai.request(server)
          .post('/api/basic/users/signup')
          .send(data)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('success').eq(true);
            res.body.should.have.property('code').eq(100);
            res.body.should.have.property('message');
            done();
          });
      });

      it('should return success', (done) => {
        const data = { email: 'admin+verify@devilmaydie.name' };
        chai.request(server)
          .post('/api/basic/users/verify_email/resend')
          .send(data)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('success').eq(true);
            res.body.should.have.property('code').eq(100);
            res.body.should.have.property('message');
            done();
          });
      });

      it('should return success', (done) => {
        const data = { email: 'admin+verify@devilmaydie.name' };
        chai.request(server)
          .post('/api/basic/users/verify_email/resend')
          .send(data)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('success').eq(true);
            res.body.should.have.property('code').eq(100);
            res.body.should.have.property('message');
            done();
          });
      });

      it('should return success', (done) => {
        const data = { email: 'admin+verify@devilmaydie.name' };
        chai.request(server)
          .post('/api/basic/users/verify_email/resend')
          .send(data)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('success').eq(true);
            res.body.should.have.property('code').eq(100);
            res.body.should.have.property('message');
            done();
          });
      });

      it('should return error - too much requests', (done) => {
        const data = { email: 'admin+verify@devilmaydie.name' };
        chai.request(server)
          .post('/api/basic/users/verify_email/resend')
          .send(data)
          .end((err, res) => {
            res.should.have.status(429);
            res.body.should.have.property('success').eq(false);
            res.body.should.have.property('message');
            done();
          });
      });
    });
  });
}