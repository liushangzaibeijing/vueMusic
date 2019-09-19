import axios from 'axios';
let base = '/utopia';
import errmsg from './catchErr'

//post请求测试
export const login = params => axios.post(base + '/login/checkLogin', params).then(res => res.data).catch(err => {errmsg(err.response.status)});
//get请求测试
export const  getMusic = params => axios.get(url,params).then(res=>res.data).catch(err => {errmsg(err.response.status)});


export const hotSingerList = params => axios.get("music/hotSingerListByPage",params).then(res=>res.data).catch(err => {errmsg(err.response.status)});
