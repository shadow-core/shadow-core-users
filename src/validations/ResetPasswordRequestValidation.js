import { BasicValidatorInterface } from 'shadow-core-basic';
import EmailExistsValidator from './validators/EmailExistsValidator';

const { body } = require('express-validator/check');
const jsonResponses = require('../json_responses/resetPasswordRequest');

export default class ResetPasswordRequestValidation extends BasicValidatorInterface {
  validators() {
    return [
      body('email').trim()
        .not().isEmpty().withMessage(jsonResponses.errors.email.empty)
        .isEmail().withMessage(jsonResponses.errors.email.format)
        .custom(EmailExistsValidator(this)).withMessage(jsonResponses.errors.email.noUser),
    ];
  }
}
