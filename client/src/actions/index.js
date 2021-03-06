import axios from "../axios"

const youtubeApiKey = "AIzaSyDm6WbSwEJ--G-SsASkiL_fLNaD6qmNKrc"

export const fetchGroupName = async () => {
  return axios
    .request({
      method: "get",
      url: "/groupName",
      noRetry: true,
    })
    .then(response => {
      // callBack(response.data)
      return Promise.resolve(response.data)
    })
    .catch(err => {
      return Promise.reject(err)
    })
}

export const setGroupName = async data => {
  return axios
    .request({
      method: "post",
      url: "/groupName",
      data,
      noRetry: true,
    })
    .then(response => {
      // callBack(response.data)
      return Promise.resolve(response.data)
    })
    .catch(err => {
      return Promise.reject(err)
    })
}

export const fetch1stContent = groupId => {
  return new Promise((resolve, reject) => {
    axios
      .request({
        method: "get",
        url: `/appStart?groupId=${groupId}`,
        noRetry: true,
      })
      .then(response => {
        return resolve(response.data)
      })
      .catch(err => {
        console.log(err)
        return reject(err)
      })
  })
}

export const deleteContent = (videoId, groupId, callBack) => {
  return axios
    .request({
      method: "get",
      url: `/deteteVideo?videoId=${videoId}&groupId=${groupId}`,
      noRetry: true,
    })
    .then(response => {
      callBack(response.data)
      return Promise.resolve(response.data)
    })
    .catch(err => {
      console.log(err)
      return Promise.reject(err)
    })
}

export const videoContent = videoId => {
  return axios
    .request({
      method: "get",
      url: `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${youtubeApiKey}&part=snippet,contentDetails`,
      noRetry: true,
    })
    .then(response => {
      return Promise.resolve(response.data)
    })
    .catch(err => {
      console.log(err.data)
      return Promise.reject(err.data)
    })
}
