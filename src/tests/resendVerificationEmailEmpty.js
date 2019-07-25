const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiSubset = require('chai-subset');

const should = chai.should();
const { expect } = chai;

chai.use(chaiHttp);
chai.use(chaiSubset);

export default function ExpressCoreUsersTestsResendVerificationEmailEmpty(server, apiPrefix) {
  describe('Resend verification email endpoint', () => {
    describe('GET /users/verify_email/resend', () => {
      it('must return 404 - there is not verification process', (done) => {
        chai.request(server)
          .post(`${apiPrefix}/users/verify_email/resend`)
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
