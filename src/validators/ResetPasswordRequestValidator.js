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
    return ((value, { req }) => new Promise((resolve, reject) => {
      if (!value) {
        return resolve();
      }
      if (!validator.isEmail(value)) {
        return resolve();
      }
      this.models.User.findByEmail(value, (err, user) => {
        if (err) {
          return reject();
        }
        if (user) {
          this.user = user;
          req.foundUser = this.user;
          return resolve();
        }
        return reject();
      });
    }));
  }
}
