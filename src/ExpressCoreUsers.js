import { ExpressCoreBasic } from 'express-core-basic';
import UserModel from "./models/user";

const crypto = require('crypto');
const bcrypt = require('bcryptjs');

/**
 * This is main class with all required methods for user actions.
 */
export default class ExpressCoreUsers extends ExpressCoreBasic {
    /**
     * Constructor.
     *
     * Add all JSON answers we need.
     */
    constructor() {
        super();
        this.addJsonAnswers('signup_user', require('./json_answers/signup_user'));
        this.addJsonAnswers('verify_email_resend', require('./json_answers/verify_email_resend'));
        this.addJsonAnswers('verify_email', require('./json_answers/verify_email'));
        this.addJsonAnswers('reset_password_request', require('./json_answers/reset_password_request'));
        this.addJsonAnswers('reset_password', require('./json_answers/reset_password'));
        this.addJsonAnswers('reset_password_check', require('./json_answers/reset_password_check'));
    }

    /**
     * Find user by email.
     *
     * @param email
     * @returns {Promise.<void>}
     */
    async getUserByEmail(email) {
        let user = await UserModel.findByEmail(email).exec();
        return user;
    }

    /**
     * Save new user/account
     *
     * @param email
     * @param password
     * @constructor
     */
    async ProcessSignUpUser(email, password) {
        const verification_code = crypto.randomBytes(64).toString('hex');

        /* @TODO Make this method as model method */
        let newUser = new UserModel({
            'email': email,
            'password_hash': bcrypt.hashSync(password, 10),
            'isEmailVerified': false,
            'verificationCode': verification_code,
        });
        await newUser.save();
        return newUser;
    }

    /**
     * Check if there was more than 3 resend verification requests for last hour.
     *
     * @param user
     * @returns {boolean}
     */
    checkTooMuchRequests(user) {
        if (!user.verificationResendAmount) {
            return false;
        }
        /* @TODO make timeout configurable */
        if ((user.verificationResendRequestDate.getTime() + 3600*1000) > Date.now() && user.verificationResendAmount >= 3) {
            return true;
        }
        return false;
    }

    /**
     * Update some data for user for resend verification
     *
     * @param user
     * @returns {Promise}
     */
    async updateResendVerification(user) {
        let last_request_date = user.verificationResendRequestDate;
        user.verificationResendRequestDate = Date.now();
        user.verificationResendAmount = user.verificationResendAmount + 1;
        /* @TODO make timeout configurable */
        if (last_request_date && (last_request_date.getTime() + 3600*1000 < Date.now())) { //1 hour passed, reset requests amount
            user.verificationResendAmount = 1;
        }

        await user.save();
    }

    /**
     * Find user by verification token.
     *
     * @param verification_token
     * @returns {Promise}
     */
    async getUserByVerificationToken(verification_token) {
        /* @TODO make this model method */
        let user = await UserModel.findOne(
            {
                'verificationCode': verification_token,
                'isEmailVerified': false,
            }
        ).exec();
        return user;
    }

    /**
     * Save required data for password reset
     *
     * @param user
     * @returns {Promise}
     */
    async prepareResetPassword(user) {
        let last_request_date = user.resetPasswordRequestDate;
        user.resetPasswordIsRequested = true;
        user.resetPasswordRequestDate = Date.now();
        user.resetPasswordToken = crypto.randomBytes(64).toString('hex');
        user.resetPasswordRequestsAmount = user.resetPasswordRequestsAmount + 1;
        /* @TODO make timeout configurable */
        if (last_request_date && (last_request_date.getTime() + 3600*1000 < Date.now())) { //1 hour passed, reset requests amount
            user.resetPasswordRequestsAmount = 1;
        }

        await user.save();
    }

    /**
     * Check if there was more than 3 request for last hour.
     *
     * @param user
     * @returns {boolean}
     */
    checkTooMuchResetPasswordRequests(user) {
        if (!user.resetPasswordRequestsAmount) {
            return false;
        }
        /* @TODO make timeout configurable */
        if ((user.resetPasswordRequestDate.getTime() + 3600*1000) > Date.now() && user.resetPasswordRequestsAmount >= 3) {
            return true;
        }
        return false;
    }

    /**
     * Find user with password reset token.
     * @TODO make this a model method.
     *
     * @param token
     * @return {Promise}
     */
    async getUserByPasswordResetToken(token) {
        let user = UserModel.findOne({
            resetPasswordToken: token,
            resetPasswordIsRequested: true,
        }).exec();
        return user;
    }

    /**
     * Update user password
     *
     * @param user
     * @param password
     * @return {Promise}
     */
    async updateUserPassword(user, password) {
        user.password_hash = bcrypt.hashSync(password, 10);
        user.resetPasswordIsRequested = false;
        user.resetPasswordRequestDate = null;
        user.resetPasswordRequestsAmount = 0;
        user.resetPasswordToken = null;
        await user.save();
    }
}