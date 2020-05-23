import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { fakeAccountLogin, getFakeCaptcha,signout } from '@/services/api';
import { setAuthority,clearCookie } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);

      const authDict = response.success ?payload: {user_name:''}
      yield put({
        type: 'changeLoginStatus',
        payload: authDict,
      });
      if (response.success) {  
        reloadAuthorized();
      }
      yield put({type: 'changeLoginStatus',payload: response});
    },
    *logout({ payload }, { call, put }) {

      const response = yield call(signout, payload);
      reloadAuthorized();
      // 清除缓存cookie
      clearCookie();
      const { redirect } = getPageQuery();
      // redirect
      if (window.location.pathname !== '/user/login' && !redirect) {
        yield put(
          routerRedux.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          })
        );
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.user_name);
      return {
        ...state,
        ...payload
      };
    },
  },
};
