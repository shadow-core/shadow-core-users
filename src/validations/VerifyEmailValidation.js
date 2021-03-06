import { BasicValidatorInterface } from 'shadow-core-basic';

const { body } = require('express-validator/check');
const jsonResponses = require('../json_responses/verifyEmail');

export default class VerifyEmailValidation extends BasicValidatorInterface {
  validators() {
    return [
      body('verificationToken').trim().not().isEmpty()
        .withMessage(jsonResponses.errors.token.empty),
    ];
  }
}
