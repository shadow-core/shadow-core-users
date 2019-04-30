const { checkSchema } = require('express-validator/check');
const json_answers = require('../json_answers/reset_password_request');
import validator from 'validator';
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
            options: (value) => {
                if (!value || value === undefined) {
                    value = '';
                }
                if (!validator.isEmail(value)) {
                    return true;
                }
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
                        return true;
                    } else {
                        throw new Error(JSON.stringify(json_answers.error_no_user));
                    }
                })
            },
        },
        trim: true,
    }
});