import { stringify } from 'qs';
import request from '@/utils/request';


export async function queryTags() {
  return request('/api/tags');
}

// 登录
export async function fakeAccountLogin(params) {
  return request('/users/signin', {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        body: stringify(params)
      });
}

// 注销 退出
export async function signout(params){

  return request('/users/signout', {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        body: stringify({})
      });
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}
