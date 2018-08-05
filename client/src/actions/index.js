import axios from '../axios';

export const fetch1stContent = (callBack) => {
    return axios.request({
        method: 'get',
        url: '/appStart',
        'noRetry': true,
    }).then((response) => {
        callBack(response.data)
    }).catch((err) => {
        console.log(err);
    });
};

export const deleteContent = (videoId, callBack) => {
    return axios.request({
        method: 'get',
        url: `/deteteVideo?videoId=${videoId}`,
        'noRetry': true,
    }).then((response) => {
        callBack(response.data)
    }).catch((err) => {
        console.log(err);
    });
};