import validator from 'validator';
import { BasicValidatorInterface } from 'shadow-core-basic';

const { body } = require('express-validator/check');
const jsonResponses = require('../json_responses/resetPasswordRequest');

export default class ResetPasswordRequestValidator extends BasicValidatorInterface {
  validators() {
    return [
      body('email').trim()
        .not().isEmpty().withMessage(jsonResponses.errorEmailIsLength)
        .isEmail().withMessage(jsonResponses.errorEmailFormat)
        .custom(this.getEmailValidatorExists()).withMessage(jsonResponses.errorNoUser),
    ];
  }

  getEmailValidatorExists() {
    return ((value) => {
      const checkValue = value;
      if (!validator.isEmail(checkValue)) {
        return true;
      }
      return new Promise(((resolve, reject) => {
        this.models.User.findByEmail(checkValue, (err, user) => {
          if (err) {
            reject(err);
          } else {
            resolve(user);
          }
        });
      })).then((user) => {
        if (user) {
          return true;
        }
        return false;
      });
    });
  }
}
