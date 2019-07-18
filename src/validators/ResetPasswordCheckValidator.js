import { BasicValidatorInterface } from 'shadow-core-basic';

const { body } = require('express-validator/check');
const jsonResponses = require('../json_responses/resetPasswordCheck');

export default class ResetPasswordCheckValidator extends BasicValidatorInterface {
  validators() {
    return [
      body('token').trim()
        .not().isEmpty().withMessage(jsonResponses.errorTokenIsLength)
    ];
  }
}
