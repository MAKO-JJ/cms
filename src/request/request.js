import axios from 'axios';
import store from '@/store';
import { getToken, setToken, getType } from '@/utils/auth';
import { MessageBox, Message } from 'element-ui';
import router from '@/router';

// import qs from 'qs';

const instance = axios.create({
    // baseURL: process.env.VUE_APP_BASE_API,
    timeout: 5000
});

// 请求前拦截
instance.interceptors.request.use(config => {
    // console.log(process.env.VUE_APP_BASE_API);
    const token = getToken();
    if (config.method === 'post') {
        if (token) {
            // 这里根据接口要求，token放在哪里就加哪里
            config.headers['Authorization'] = token
        }
        // config.data = qs.stringify(config.data, { allowDots: true, arrayFormat: 'repeat' })
    } else if (config.method === 'get') {
        // console.log(config);
        if (token) {
            config.headers['Authorization'] = token;

            // config.url+=('?'+qs.stringify(config.params,{arrayFormat:'repeat'}))
            // delete config.params
            if (config.url == "/api/order/export") {
                // 解决下载后文件乱码问题（blob）
                config['responseType'] = "blob";
            }
        }
    }
    config.headers["Content-type"] = "application/json;charset=UTF-8";
    // config.headers["Content-type"] = "application/x-www-form-urlencoded";
    return config;
}, error => {
    return Promise.reject(error);
}
);

// 返回结果拦截
instance.interceptors.response.use(result => {
    // console.log(result.data);
    let code = result.data.code;
    // 与后端的约定，延长 token 机制
    if (result.headers['refreshtoken']) {
        setToken(result.headers['refreshtoken']);
    }
    
    if (code === 200) {
        return Promise.resolve(result.data);

    } else if (code === 40102) {
        // 40102 登录信息过期
        // Message.error(result.data.message);
        MessageBox.confirm('您已注销，您可以取消停留在该页上，或再次登录', {
            confirmButtonText: '返回登陆页面',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            logout();
        })
        return Promise.reject(result.data);

    } else {
        Message.error(result.data.message);
        return Promise.reject(result.data)

    }

}, error => {
    return Promise.reject(error);
});

async function logout() {
    await store.dispatch("user/logout");
    let path = getType();
    router.push(`${path}`);
}

export default instance;