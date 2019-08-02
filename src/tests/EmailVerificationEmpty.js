const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiSubset = require('chai-subset');

const should = chai.should();
const { expect } = chai;

chai.use(chaiHttp);
chai.use(chaiSubset);

export default function EmailVerificationEmpty(app, options = {}) {
  describe('User email verification endpoint', () => {
    describe('POST /users/verify_email', () => {
      it('must return 404, there not verification process', (done) => {
        chai.request(app.server)
          .post(`${options.apiPrefix}/users/verify_email`)
          .send()
          .end((err, res) => {
            res.should.have.status(404);
            res.body.should.have.property('success').eq(false);
            res.body.should.have.property('type').eq('endpoint');
            done();
          });
      });
    });
  });
}
