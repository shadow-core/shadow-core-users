const { checkSchema } = require('express-validator/check');
const json_answers = require('../json_answers/verify_email_resend');
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
                        if (user.isEmailVerified) {
                            throw new Error(JSON.stringify(json_answers.error_verified));
                        }
                        return true;
                    } else {
                        throw new Error(JSON.stringify(json_answers.error_verified));
                    }
                })
            },
        },
        trim: true,
    }
});