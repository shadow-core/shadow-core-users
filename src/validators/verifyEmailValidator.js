const { checkSchema } = require('express-validator/check');
const jsonResponses = require('../json_responses/verify_email');

export default function () {
  return checkSchema({
    verification_token: {
      in: ['body'],
      isLength: {
        errorMessage: jsonResponses.error_no_verification_token,
        options: { min: 1 },
      },
      trim: true,
    },
  });
}
