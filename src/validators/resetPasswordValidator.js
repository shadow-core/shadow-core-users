const { checkSchema } = require('express-validator/check');
const json_answers = require('../json_answers/reset_password');

export default checkSchema({
  token: {
    in: ['body'],
    isLength: {
      errorMessage: json_answers.error_token_is_length,
      options: { min: 1 },
    },
    trim: true,
  },
  password: {
    in: ['body'],
    isLength: {
      errorMessage: json_answers.error_password_is_length,
      options: { min: 1 },
    },
  },
  password_check: {
    in: ['body'],
    isLength: {
      errorMessage: json_answers.error_password_check_is_length,
      options: { min: 1 },
    },
    custom: {
      errorMessage: json_answers.error_passwords_not_equal,
      options: (value, { req }) => {
        if (value === req.body.password) {
          return true;
        }
        return false;
      },
    },
  },
});
