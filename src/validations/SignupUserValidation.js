import { BasicValidatorInterface } from 'shadow-core-basic';
import GetPasswordCheckValidatorNotEqual from './validators/GetPasswordCheckValidatorNotEqual';
import GetEmailValidatorNotUnique from './validators/GetEmailValidatorNotUnique';

const { body } = require('express-validator/check');
const jsonResponses = require('../json_responses/signupUser');

/**
 * @class SignupUserValidator
 * @class validator for SignupUser action.
 */
export default class SignupUserValidation extends BasicValidatorInterface {
  /**
   * Return validators.
   *
   * @return {any[]}
   */
  validators() {
    return [
      // email
      body('email').trim()
        .not().isEmpty().withMessage(jsonResponses.errorEmailIsLength)
        .isEmail().withMessage(jsonResponses.errorEmailFormat)
        .custom(GetEmailValidatorNotUnique(this))
        .withMessage(jsonResponses.errorEmailIsNotUnique),

      // password
      body('password').not().isEmpty().withMessage(jsonResponses.errorPasswordIsLength),

      // password check
      body('passwordCheck').not().isEmpty().withMessage(jsonResponses.errorPasswordCheckIsLength)
        .custom(GetPasswordCheckValidatorNotEqual())
        .withMessage(jsonResponses.errorPasswordsNotEqual),
    ];
  }


}
