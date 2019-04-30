export default {
    'signup_user': require('./signup_user_validator').default,
    'verify_email_resend': require('./verify_email_resend_validator').default,
    'verify_email': require('./verify_email_validator').default,
    'reset_password_request': require('./reset_password_request_validator').default,
    'reset_password': require('./reset_password_validator').default,
    'reset_password_check': require('./reset_password_check_validator').default,
}