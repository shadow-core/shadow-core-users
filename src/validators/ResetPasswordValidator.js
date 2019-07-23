import { BasicValidatorInterface } from 'shadow-core-basic';

const { body } = require('express-validator/check');
const jsonResponses = require('../json_responses/resetPassword');

export default class ResetPasswordValidator extends BasicValidatorInterface {
  validators() {
    return [
      body('token').trim().not().isEmpty().withMessage(jsonResponses.errorTokenIsLength),
      body('password').not().isEmpty().withMessage(jsonResponses.errorPasswordIsLength),
      body('passwordCheck').not().isEmpty().withMessage(jsonResponses.errorPasswordCheckIsLength)
        .custom(this.getPasswordCheckValidatorNotEqual())
        .withMessage(jsonResponses.errorPasswordsNotEqual),
    ];
  }

  /**
   * Passwords are not equal custom validator
   *
   * @return {function(*, {req: *}): boolean}
   */
  getPasswordCheckValidatorNotEqual() {
    return ((value, { req }) => {
      if (value && req.body.password) {
        return value === req.body.password;
      }
      return true;
    });
  }
}
