import { BasicValidatorInterface } from 'shadow-core-basic';
import GetPasswordCheckValidatorNotEqual from './validators/GetPasswordCheckValidatorNotEqual';

const { body } = require('express-validator/check');
const jsonResponses = require('../json_responses/resetPassword');

export default class ResetPasswordValidation extends BasicValidatorInterface {
  validators() {
    return [
      body('token').trim().not().isEmpty().withMessage(jsonResponses.errors.token.empty),
      body('password').not().isEmpty().withMessage(jsonResponses.errors.password.empty),
      body('passwordCheck').not().isEmpty().withMessage(jsonResponses.errors.passwordCheck.empty)
        .custom(GetPasswordCheckValidatorNotEqual())
        .withMessage(jsonResponses.errors.passwordCheck.notEqual),
    ];
  }


}
