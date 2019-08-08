import { BasicValidatorInterface } from 'shadow-core-basic';
import PasswordCheckValidatorNotEqual from './validators/PasswordCheckValidatorNotEqual';
import EmailValidatorNotUnique from './validators/EmailValidatorNotUnique';

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
        .custom(EmailValidatorNotUnique(this))
        .withMessage(jsonResponses.errors.email.notUnique),

      // password
      body('password').not().isEmpty().withMessage(jsonResponses.errors.password.empty),

      // password check
      body('passwordCheck').not().isEmpty().withMessage(jsonResponses.errors.passwordCheck.empty)
        .custom(PasswordCheckValidatorNotEqual())
        .withMessage(jsonResponses.errors.passwordCheck.notEqual),
    ];
  }


}
