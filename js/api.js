// const host = process.env.SV_HOST;
// const port = process.env.SV_PORT;

const host = 'localhost';
const port = 3000;
const http = `http://${host}:${port}/api`;

export const login = `${http}/accounts/login`;
export const users = `${http}/users`;
export const products = `${http}/products`;