import axios from 'axios';
/**
 * [baseURL address to the server api (URL) for production]
 * @type {String}
 */


let baseURL = 'https://tgif-music-fest.herokuapp.com/'; // dev server
// let baseURL = 'http://localhost:5000'; // dev server

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
