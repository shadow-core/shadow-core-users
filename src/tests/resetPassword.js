const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiSubset = require('chai-subset');

const should = chai.should();
const { expect } = chai;

chai.use(chaiHttp);
chai.use(chaiSubset);

export default function ExpressCoreUsersTestsSignup(server, models) {
  let token = null;
  let authToken = null;

  describe('Reset passwords endpoint', () => {
    describe('/users/reset_password/request', () => {
      it('must return 404 on get request', (done) => {
        chai.request(server)
          .get('/api/basic/users/reset_password/request')
          .send()
          .end((err, res) => {
            res.should.have.status(404);
            res.body.should.have.property('success').eq(false);
            res.body.should.have.property('type').eq('endpoint');
            done();
          });
      });

      it('must return error if no data is provided', (done) => {
        chai.request(server)
          .post('/api/basic/users/reset_password/request')
          .send()
          .end((err, res) => {
            res.should.have.status(422);
            res.body.should.have.property('success').eq(false);
            res.body.should.have.property('code').eq(422);
            res.body.should.have.property('errors');
            res.body.errors.should.be.a('array');
            res.body.errors.should.containSubset([{ code: 1, param: 'email' }]);
            res.body.errors.should.containSubset([{ code: 2, param: 'email' }]);
            done();
          });
      });

      it('must return error if email does not exist', (done) => {
        const data = { email: 'testemail@gmail.com' };
        chai.request(server)
          .post('/api/basic/users/reset_password/request')
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

      it('user data must be correct', (done) => {
        models.User.findOne({ email: 'test@sensorlab.io' }).exec().then((user) => {
          user._id.should.exist();
          user.resetPasswordIsRequested.should.equal(false);
          user.resetPasswordRequestsAmount.should.equal(0);
          done();
        });
      });


      it('must return success', (done) => {
        const data = { email: 'test@sensorlab.io' };
        chai.request(server)
          .post('/api/basic/users/reset_password/request')
          .send(data)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('success').eq(true);
            res.body.should.have.property('code').eq(100);
            res.body.should.have.property('message');
            done();
          });
      });

      it('must return success', (done) => {
        const data = { email: 'test@sensorlab.io' };
        chai.request(server)
          .post('/api/basic/users/reset_password/request')
          .send(data)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('success').eq(true);
            res.body.should.have.property('code').eq(100);
            res.body.should.have.property('message');
            done();
          });
      });

      it('must return success', (done) => {
        const data = { email: 'test@sensorlab.io' };
        chai.request(server)
          .post('/api/basic/users/reset_password/request')
          .send(data)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('success').eq(true);
            res.body.should.have.property('code').eq(100);
            res.body.should.have.property('message');
            done();
          });
      });

      it('must return error because too much requests', (done) => {
        const data = { email: 'test@sensorlab.io' };
        chai.request(server)
          .post('/api/basic/users/reset_password/request')
          .send(data)
          .end((err, res) => {
            res.should.have.status(429);
            res.body.should.have.property('code').eq(429);
            res.body.should.have.property('success').eq(false);
            res.body.should.have.property('message');
            done();
          });
      });

      it('user data must be correct', (done) => {
        models.User.findOne({ email: 'test@sensorlab.io' }).exec().then((user) => {
          user._id.should.exist();
          user.resetPasswordIsRequested.should.equal(true);
          user.resetPasswordToken.should.exist();
          token = user.resetPasswordToken;
          done();
        });
      });
    });

    describe('/users/reset_password/check', () => {
      it('must return 404 on get', (done) => {
        chai.request(server)
          .get('/api/basic/users/reset_password/check')
          .send()
          .end((err, res) => {
            res.should.have.status(404);
            res.body.should.have.property('success').eq(false);
            res.body.should.have.property('type').eq('endpoint');
            done();
          });
      });

      it('must return error if no data is provided', (done) => {
        chai.request(server)
          .post('/api/basic/users/reset_password/check')
          .send()
          .end((err, res) => {
            res.should.have.status(422);
            res.body.should.have.property('success').eq(false);
            res.body.should.have.property('code').eq(422);
            res.body.should.have.property('errors');
            res.body.errors.should.be.a('array');
            res.body.errors.should.containSubset([{ code: 1, param: 'token' }]);
            done();
          });
      });

      it('must return error on random token', (done) => {
        const data = { token: 'somerandomtoken' };
        chai.request(server)
          .post('/api/basic/users/reset_password/check')
          .send(data)
          .end((err, res) => {
            res.should.have.status(404);
            res.body.should.have.property('code').eq(404);
            res.body.should.have.property('message');
            res.body.should.have.property('success').eq(false);
            res.body.should.have.property('type').eq('object');
            res.body.should.have.property('object_type').eq('reset_password_token');
            done();
          });
      });

      it('success on real token', (done) => {
        const data = { token };
        chai.request(server)
          .post('/api/basic/users/reset_password/check')
          .send(data)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('success').eq(true);
            res.body.should.have.property('code').eq(100);
            res.body.should.have.property('message');
            done();
          });
      });
    });

    describe('/users/reset_password', () => {
      it('must return 404 on get', (done) => {
        chai.request(server)
          .get('/api/basic/users/reset_password')
          .send()
          .end((err, res) => {
            res.should.have.status(404);
            res.body.should.have.property('success').eq(false);
            res.body.should.have.property('type').eq('endpoint');
            done();
          });
      });

      it('must return error on empty data', (done) => {
        chai.request(server)
          .post('/api/basic/users/reset_password')
          .send()
          .end((err, res) => {
            res.should.have.status(422);
            res.body.should.have.property('success').eq(false);
            res.body.should.have.property('code').eq(422);
            res.body.should.have.property('errors');
            res.body.errors.should.be.a('array');
            res.body.errors.should.containSubset([{ code: 1, param: 'token' }]);
            res.body.errors.should.containSubset([{ code: 2, param: 'password' }]);
            res.body.errors.should.containSubset([{ code: 3, param: 'password_check' }]);
            done();
          });
      });

      it('must return error on incorrect token', (done) => {
        const data = { token: 'somerandomtoken' };
        chai.request(server)
          .post('/api/basic/users/reset_password')
          .send(data)
          .end((err, res) => {
            res.should.have.status(422);
            res.body.should.have.property('success').eq(false);
            res.body.should.have.property('code').eq(422);
            res.body.should.have.property('errors');
            res.body.errors.should.be.a('array');
            res.body.errors.should.containSubset([{ code: 2, param: 'password' }]);
            res.body.errors.should.containSubset([{ code: 3, param: 'password_check' }]);
            done();
          });
      });

      it('must return error if no passwords are provided', (done) => {
        const data = { token };
        chai.request(server)
          .post('/api/basic/users/reset_password')
          .send(data)
          .end((err, res) => {
            res.should.have.status(422);
            res.body.should.have.property('success').eq(false);
            res.body.should.have.property('code').eq(422);
            res.body.should.have.property('errors');
            res.body.errors.should.be.a('array');
            res.body.errors.should.containSubset([{ code: 2, param: 'password' }]);
            res.body.errors.should.containSubset([{ code: 3, param: 'password_check' }]);
            done();
          });
      });

      it('must return error if password check is not provided', (done) => {
        const data = { token, password: 'test' };
        chai.request(server)
          .post('/api/basic/users/reset_password')
          .send(data)
          .end((err, res) => {
            res.should.have.status(422);
            res.body.should.have.property('success').eq(false);
            res.body.should.have.property('code').eq(422);
            res.body.should.have.property('errors');
            res.body.errors.should.be.a('array');
            res.body.errors.should.containSubset([{ code: 3, param: 'password_check' }]);
            done();
          });
      });

      it('must return error if password is not provided', (done) => {
        const data = { token, password_check: 'test' };
        chai.request(server)
          .post('/api/basic/users/reset_password')
          .send(data)
          .end((err, res) => {
            res.should.have.status(422);
            res.body.should.have.property('success').eq(false);
            res.body.should.have.property('code').eq(422);
            res.body.should.have.property('errors');
            res.body.errors.should.be.a('array');
            res.body.errors.should.containSubset([{ code: 2, param: 'password' }]);
            done();
          });
      });

      it('must return error if passwords are not equal', (done) => {
        const data = { token, password: 'Test', password_check: 'test' };
        chai.request(server)
          .post('/api/basic/users/reset_password')
          .send(data)
          .end((err, res) => {
            res.should.have.status(422);
            res.body.should.have.property('success').eq(false);
            res.body.should.have.property('code').eq(422);
            res.body.should.have.property('errors');
            res.body.errors.should.be.a('array');
            res.body.errors.should.containSubset([{ code: 4, param: 'password_check' }]);
            done();
          });
      });

      it('must return success', (done) => {
        const data = { token, password: 'password', password_check: 'password' };
        chai.request(server)
          .post('/api/basic/users/reset_password')
          .send(data)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('success').eq(true);
            res.body.should.have.property('code').eq(100);
            res.body.should.have.property('message');
            done();
          });
      });

      it('must return error because we used token', (done) => {
        const data = { token, password: 'password', password_check: 'password' };
        chai.request(server)
          .post('/api/basic/users/reset_password')
          .send(data)
          .end((err, res) => {
            res.should.have.status(404);
            res.body.should.have.property('code').eq(404);
            res.body.should.have.property('message');
            res.body.should.have.property('success').eq(false);
            res.body.should.have.property('type').eq('object');
            res.body.should.have.property('object_type').eq('reset_password_token');
            done();
          });
      });

      it('user data must be correct', (done) => {
        models.User.findOne({ email: 'test@sensorlab.io' }).exec().then((user) => {
          user._id.should.exist();
          user.resetPasswordIsRequested.should.equal(false);
          done();
        });
      });

      it('should NOT authorize with old password', (done) => {
        const data = {
          email: 'test@sensorlab.io',
          password: 'test',
        };
        chai.request(server)
          .post('/api/v1/auth/user/token')
          .send(data)
          .end((err, res) => {
            res.should.have.status(401);
            done();
          });
      });

      it('should authorize with new password', (done) => {
        const data = {
          email: 'test@sensorlab.io',
          password: 'password',
        };
        chai.request(server)
          .post('/api/v1/auth/user/token')
          .send(data)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('token');
            authToken = res.body.token;
            done();
          });
      });

      it('change password back', (done) => {
        const data = {
          old_password: 'password',
          new_password: 'test',
          new_password_check: 'test',
        };
        chai.request(server)
          .post('/api/v1/profile/change_password')
          .set('Authorization', `Bearer ${authToken}`)
          .send(data)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('success').eq(true);
            res.body.should.have.property('code').eq(100);
            res.body.should.have.property('message');
            done();
          });
      });
    });
  });
}
