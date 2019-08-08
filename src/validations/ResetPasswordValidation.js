import { BasicValidatorInterface } from 'shadow-core-basic';
import PasswordCheckValidatorNotEqual from './validators/PasswordCheckValidatorNotEqual';

const { body } = require('express-validator/check');
const jsonResponses = require('../json_responses/resetPassword');

export default class ResetPasswordValidation extends BasicValidatorInterface {
  validators() {
    return [
      body('token').trim().not().isEmpty().withMessage(jsonResponses.errors.token.empty),
      body('password').not().isEmpty().withMessage(jsonResponses.errors.password.empty),
      body('passwordCheck').not().isEmpty().withMessage(jsonResponses.errors.passwordCheck.empty)
        .custom(PasswordCheckValidatorNotEqual())
        .withMessage(jsonResponses.errors.passwordCheck.notEqual),
    ];
  }


}
