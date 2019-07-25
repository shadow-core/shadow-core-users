import { BasicValidatorInterface } from 'shadow-core-basic';
import GetPasswordCheckValidatorNotEqual from './validators/GetPasswordCheckValidatorNotEqual';

const { body } = require('express-validator/check');
const jsonResponses = require('../json_responses/resetPassword');

export default class ResetPasswordValidation extends BasicValidatorInterface {
  validators() {
    return [
      body('token').trim().not().isEmpty().withMessage(jsonResponses.errorTokenIsLength),
      body('password').not().isEmpty().withMessage(jsonResponses.errorPasswordIsLength),
      body('passwordCheck').not().isEmpty().withMessage(jsonResponses.errorPasswordCheckIsLength)
        .custom(GetPasswordCheckValidatorNotEqual())
        .withMessage(jsonResponses.errorPasswordsNotEqual),
    ];
  }


}
