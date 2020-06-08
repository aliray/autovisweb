import React from 'react';
import Redirect from 'umi/redirect';
import pathToRegexp from 'path-to-regexp';
import { connect } from 'dva';
import Authorized from '@/utils/Authorized';
import { getAuthority } from '@/utils/authority';
import Exception403 from '@/pages/Exception/403';
import router from 'umi/router';

function AuthComponent({ children, location, routerData }) {
  const auth = getAuthority();
  console.log(auth);
  const getRouteAuthority = (path, routeData) => {
    let authorities;
    routeData.forEach(route => {
      // match prefix
      if (pathToRegexp(`${route.path}(.*)`).test(path)) {
        authorities = route.authority || authorities;

        // get children authority recursively
        if (route.routes) {
          authorities = getRouteAuthority(path, route.routes) || authorities;
        }
      }
    });
    return authorities;
  };
  
  if(auth == null){
    router.push('/user/login');
  }

  return (
    <Authorized
      authority={getRouteAuthority(location.pathname, routerData)}
      noMatch={auth==null ? <Redirect to="/user/login" /> :<Exception403 />}
    >
      {children}
    </Authorized>
  );
}
export default connect(({ menu: menuModel }) => ({
  routerData: menuModel.routerData,
}))(AuthComponent);
