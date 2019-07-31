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
        .not().isEmpty().withMessage(jsonResponses.errors.email.empty)
        .isEmail().withMessage(jsonResponses.errors.email.format)
        .custom(GetEmailValidatorNotUnique(this))
        .withMessage(jsonResponses.errors.email.notUnique),

      // password
      body('password').not().isEmpty().withMessage(jsonResponses.errors.password.empty),

      // password check
      body('passwordCheck').not().isEmpty().withMessage(jsonResponses.errors.passwordCheck.empty)
        .custom(GetPasswordCheckValidatorNotEqual())
        .withMessage(jsonResponses.errors.passwordCheck.notEqual),
    ];
  }


}
