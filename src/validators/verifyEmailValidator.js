const { checkSchema } = require('express-validator/check');
const json_answers = require('../json_answers/verify_email');

export default checkSchema({
  verification_token: {
    in: ['body'],
    isLength: {
      errorMessage: json_answers.error_no_verification_token,
      options: { min: 1 },
    },
    trim: true,
  },
});
