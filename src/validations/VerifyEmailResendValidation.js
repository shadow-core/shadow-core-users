import { BasicValidatorInterface } from 'shadow-core-basic';
import EmailExistsValidator from './validators/EmailExistsValidator';
import EmailVerifiedValidator from './validators/EmailVerifiedValidator';

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
      .custom(EmailExistsValidator(this)).withMessage(jsonResponses.errorNoUser)
      .custom(EmailVerifiedValidator(this)).withMessage(jsonResponses.errorVerified);
  }
}
