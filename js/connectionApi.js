const env = 'server';

export const limitProduct = 8;

let http = '';
if (env === 'dev') {
    http = `http://localhost:3000/api`;
} else if ('server') {
    http = `https://be-food-sharing.btecit.tech/api`;
} else {
    console.log('don\'t have env ' + env);
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


export const refreshToken = () => {
    const localRefreshToken = localStorage.getItem('refreshToken');
    fetch(refresh, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({refreshToken: localRefreshToken}),
    }).then(response => response.json().then(data => {
        if (data.status === 200) {
            const newAccessToken = data.data;
            localStorage.setItem('token', newAccessToken);
        } else {
            if (localRefreshToken !== null) {
                localStorage.removeItem('token');
            }
            console.error('Refresh token invalid');
        }
    }))
}