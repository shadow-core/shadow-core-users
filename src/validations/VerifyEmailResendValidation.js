import { BasicValidatorInterface } from 'shadow-core-basic';
import GetEmailValidatorExists from './validators/GetEmailValidatorExists';

const { body } = require('express-validator/check');
const jsonResponses = require('../json_responses/verifyEmailResend');

/**
 * @class VerifyEmailResendValidator
 * @classdesc Validators for VerifyEmailResend action
 */
export default class VerifyEmailResendValidation extends BasicValidatorInterface {
  validators() {
    return body('email').trim().not()
      .isEmpty().withMessage(jsonResponses.errorEmailIsLength)
      .isEmail().withMessage(jsonResponses.errorEmailFormat)
      .custom(GetEmailValidatorExists(this)).withMessage(jsonResponses.errorNoUser)
      .custom(this.getEmailValidatorVerified()).withMessage(jsonResponses.errorVerified);
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
