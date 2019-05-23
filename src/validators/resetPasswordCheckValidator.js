const { checkSchema } = require('express-validator/check');
const jsonAnswers = require('../json_answers/reset_password_check');

export default function () {
  return checkSchema({
    token: {
      in: ['body'],
      isLength: {
        errorMessage: jsonAnswers.error_token_is_length,
        options: { min: 1 },
      },
      trim: true,
    },
  });
}
