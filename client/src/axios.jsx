import axios from 'axios';
import { config } from 'dotenv';

/**
 * [baseURL address to the server api (URL) for production]
 * @type {String}
 */


// let baseURL = ; // dev server
let baseURL = process.env.REACT_APP_APIURL || 'https://tgif-music-fest.herokuapp.com/'; // dev server

axios.defaults.baseURL = baseURL
axios.defaults.timeout = 15000

axios.interceptors.response.use((response) => {
    return response;
}, (error) => {
    // Do something with response error
    return Promise.reject(error.response);
});

export const rootURL = baseURL;
export default axios;
