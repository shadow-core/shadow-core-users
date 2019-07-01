const { checkSchema } = require('express-validator/check');
const jsonResponses = require('../json_responses/reset_password_check');

export default function () {
  return checkSchema({
    token: {
      in: ['body'],
      isLength: {
        errorMessage: jsonResponses.error_token_is_length,
        options: { min: 1 },
      },
      trim: true,
    },
  });
}
