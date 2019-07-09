import axios from '../axios';

const youtubeApiKey = 'AIzaSyDm6WbSwEJ--G-SsASkiL_fLNaD6qmNKrc'

export const fetchGroupName = async () => {
    return axios.request({
        method: 'get',
        url: '/groupName',
        'noRetry': true,
    }).then((response) => {
        // callBack(response.data)
        return Promise.resolve(response.data);
    }).catch((err) => {
        return Promise.reject(err);
    });
};

export const setGroupName = async (data) => {
    return axios.request({
        method: 'post',
        url: '/groupName',
        data,
        'noRetry': true,
    }).then((response) => {
        // callBack(response.data)
        return Promise.resolve(response.data);
    }).catch((err) => {
        return Promise.reject(err);
    });
};





export const fetch1stContent = () => {
    return new Promise((resolve, reject) => {
        axios.request({
            method: 'get',
            url: '/appStart',
            'noRetry': true,
        }).then((response) => {
            return resolve(response.data);
        }).catch((err) => {
            console.log(err);
            return reject(err);
        });
    })
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