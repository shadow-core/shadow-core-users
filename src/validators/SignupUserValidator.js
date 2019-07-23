import { BasicValidatorInterface } from 'shadow-core-basic';
import validator from 'validator';

const { body } = require('express-validator/check');
const jsonResponses = require('../json_responses/signupUser');

/**
 * @class SignupUserValidator
 * @class validator for SignupUser action.
 */
export default class SignupUserValidator extends BasicValidatorInterface {
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
        .custom(this.getEmailValidatorNotUnique()).withMessage(jsonResponses.errorEmailIsNotUnique),

      // password
      body('password').not().isEmpty().withMessage(jsonResponses.errorPasswordIsLength),

      // password check
      body('passwordCheck').not().isEmpty().withMessage(jsonResponses.errorPasswordCheckIsLength)
        .custom(this.getPasswordCheckValidatorNotEqual())
        .withMessage(jsonResponses.errorPasswordsNotEqual),
    ];
  }

  /**
   * Email not unique custom validator
   *
   * @return {function(*=): Promise<any | never>}
   */
  getEmailValidatorNotUnique() {
    return ((value) => new Promise((resolve, reject) => {
      if (!value) {
        return resolve();
      }
      if (!validator.isEmail(value)) {
        return resolve();
      }
      this.models.User.findByEmail(value, (err, user) => {
        if (err) {
          return reject();
        } else {
          if (user) {
            return reject();
          }
          return resolve();
        }
      });
    }));
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
