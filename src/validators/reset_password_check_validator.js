const { checkSchema  } = require('express-validator/check');
const json_answers = require('../json_answers/reset_password_check');

export default checkSchema({
    token: {
        in: ['body'],
        isLength: {
            errorMessage: json_answers.error_token_is_length,
            options: { min: 1 },
        },
        trim: true,
    }
});