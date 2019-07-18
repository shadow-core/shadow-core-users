import { BasicValidatorInterface } from 'shadow-core-basic';

const { body } = require('express-validator/check');
const jsonResponses = require('../json_responses/verifyEmailResend');

/**
 * @class VerifyEmailResendValidator
 * @classdesc Validators for VerifyEmailResend action
 */
export default class VerifyEmailResendValidator extends BasicValidatorInterface {
  validators() {
    return body('email').trim().not()
      .isEmpty().withMessage(jsonResponses.errorEmailIsLength)
      .isEmail().withMessage(jsonResponses.errorEmailFormat)
      .custom(this.getEmailValidatorExists()).withMessage(jsonResponses.errorNoUser)
      .custom(this.getEmailValidatorVerified()).withMessage(jsonResponses.errorVerified);
  }

  getEmailValidatorExists() {
    return ((value) => new Promise((resolve, reject) => {
      if (!value) {
        resolve(null);
      }
      this.models.User.findByEmail(value, (err, user) => {
        if (err) {
          return reject();
        }
        if (user) {
          this.user = user;
          return resolve();
        }
        return reject();
      });
    }));
  }

  getEmailValidatorVerified() {
    return ((value) => {
      if (!value) {
        return true;
      }
      if (!this.user) {
        return true;
      }
      return (this.user.isEmailVerified !== true);
    });
  }
}
