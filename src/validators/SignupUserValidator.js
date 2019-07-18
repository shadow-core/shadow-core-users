import { BasicValidatorInterface } from 'shadow-core-basic';

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
    return ((value) => {
      return new Promise((resolve, reject) => {
        this.models.User.findByEmail(value, (err, user) => {
          if (err) {
            reject(err);
          } else {
            resolve(user);
          }
        });
      }).then((user) => {
        if (user) {
          return false;
        }
        return true;
      }).catch((error) => {
        console.log(error);
      });
    });
  }

  /**
   * Passwords are not equal custom validator
   *
   * @return {function(*, {req: *}): boolean}
   */
  getPasswordCheckValidatorNotEqual() {
    return ((value, { req }) => {
      return value === req.body.password;
    });
  }
}
