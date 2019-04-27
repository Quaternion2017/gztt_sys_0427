import apiManager from './apiManager';
import axios from 'axios';
import { message } from 'antd'

// let domain = "http://159x64197e.iask.in";
let domain = "http://localhost:8082";
let apis = apiManager.api;
//设置请求允许携带cookie信息
axios.defaults.withCredentials = true;
// 拦截请求
axios.interceptors.request.use(function (config) {
    return config
});

// 拦截相应
axios.interceptors.response.use(function (config) {
   
    return config
});
const apiRequest = {
    all: (apiName, data, success, errorMsg) => {
        let api = apis[apiName];
        return new Promise((reslove, reject) => {
            const bol = (api.url.length===api.url.lastIndexOf("/")+1);
            axios({
                method: api.method,
                url: (domain +(bol? api.url+(data!==null?data:''):api.url)),
                data: (bol?"":data),
                timeout: 10000
            }).then((response) => {
                let data = response.data;
                if (data.code > 1) {
                    message.error(data.msg, 1);
                } else if (success !== null) {
                    message.success(success, 1);
                } 
                reslove(response.data);
            }).catch((error) => {
                reject(error);
                message.error(errorMsg, 1);
            });
        })
    }
}
export default apiRequest;