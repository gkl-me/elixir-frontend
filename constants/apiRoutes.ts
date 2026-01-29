
export const AUTH_API_ROUTES = {
    LOGIN:'/auth/login',
    REGISTER:'/auth/register',
    GOOGLE_AUTH:'/auth/google-auth',
    GITHUB_AUTH:'/auth/github-auth',
    REFRESH:'/auth/refresh',
    LOGOUT:'/auth/logout',

    
    VERIFY_EMAIL:'/auth/verify',
    RESEND_EMAIL:'/auth/resend-email',

    VERIFY_OTP:'/auth/verify-otp',
    RESEND_OTP:'/auth/resend-otp',


    FORGOT_PASSWORD:'/auth/forgot-password',
    RESET_PASSWORD:'/auth/reset-password',
    
}


export const USER_API_ROUTES = {
    GET_ALL_USER:'/users/',
    TOGGLE_USER_STATUS:'/users',
}
