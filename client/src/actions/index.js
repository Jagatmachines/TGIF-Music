import axios from '../axios';

const youtubeApiKey = 'AIzaSyDm6WbSwEJ--G-SsASkiL_fLNaD6qmNKrc'

export const fetch1stContent = async (callBack) => {
    return axios.request({
        method: 'get',
        url: '/appStart',
        'noRetry': true,
    }).then((response) => {
        callBack(response.data)
        return Promise.resolve(response.data);
    }).catch((err) => {
        console.log(err);
        return Promise.reject(err);
    });
};

export const deleteContent = (videoId, callBack) => {
    return axios.request({
        method: 'get',
        url: `/deteteVideo?videoId=${videoId}`,
        'noRetry': true,
    }).then((response) => {
        callBack(response.data);
        return Promise.resolve(response.data);
    }).catch((err) => {
        console.log(err);
        return Promise.reject(err);
    });
};

export const videoContent = (videoId) => {
    return axios.request({
        method: 'get',
        url: `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${youtubeApiKey}&part=snippet,contentDetails`,
        'noRetry': true,
    }).then((response) => {
        return Promise.resolve(response.data);
    }).catch((err) => {
        console.log(err.data);
        return Promise.reject(err.data);
    })
}