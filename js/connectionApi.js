const env = 'dev';

export const limitProduct = 8;

let http = '';
if (env === 'dev') {
    http = `http://localhost:3000/api`;
} else {
    http = `https://be-food-sharing.btecit.tech/api`;
}


export const login = `${http}/accounts/login`;
export const logOut = `${http}/accounts/logout`;
export const register = `${http}/accounts/register`;
export const sendOtp = `${http}/accounts/send-otp`;
export const verifyOtp = `${http}/accounts/verify-otp`;
export const users = `${http}/users`;
export const products = `${http}/products`;
export const refresh = `${http}/accounts/refresh`;
export const checkToken = `${http}/accounts/checkToken`;
export const FeedBack = `${http}/feed-back`;
