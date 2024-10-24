// const host = process.env.SV_HOST;
// const port = process.env.SV_PORT;

const host = 'localhost';
const port = 3000;
const http = `http://${host}:${port}/api`;
const https = `https://be-food-sharing.btecit.tech/api`;

export const login = `${https}/accounts/login`;
export const users = `${https}/users`;
export const products = `${https}/products`;