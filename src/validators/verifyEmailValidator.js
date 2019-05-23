const { checkSchema } = require('express-validator/check');
const jsonAnswers = require('../json_answers/verify_email');

export default function () {
  return checkSchema({
    verification_token: {
      in: ['body'],
      isLength: {
        errorMessage: jsonAnswers.error_no_verification_token,
        options: { min: 1 },
      },
      trim: true,
    },
  });
}