const { checkSchema } = require('express-validator/check');
const json_answers = require('../json_answers/signup_user');
import UserModel from '../models/user';

export default checkSchema({
    email: {
        in: ['body'],
        isLength: {
            errorMessage: json_answers.error_email_is_length,
            options: { min: 1 },
        },
        isEmail: {
            errorMessage: json_answers.error_email_format,
        },
        custom: {
            errorMessage: json_answers.error_email_is_not_unique,
            options: (value) => {
                return new Promise(function (resolve, reject) {
                    UserModel.findByEmail(value, function (err, user) {
                        if (err) {
                            reject(err);
                        }else{
                            resolve(user)
                        }
                    });
                }).then(function (user) {
                    if (user) {
                        return false;
                    } else {
                        return true;
                    }
                })
            },
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
                return value === req.body.password
            }
        },
    }
});