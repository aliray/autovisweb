import React from 'react';
import {
  Router as DefaultRouter,
  Route,
  Switch,
  StaticRouter,
} from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/lib/renderRoutes';
import history from '@@/history';
import RendererWrapper0 from 'G:/project/at0331/src/pages/.umi/LocaleWrapper.jsx';
import _dvaDynamic from 'dva/dynamic';

const Router = require('dva/router').routerRedux.ConnectedRouter;

const routes = [
  {
    path: '/user',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "layouts__UserLayout" */ '../../layouts/UserLayout'),
          LoadingComponent: require('G:/project/at0331/src/components/PageLoading/index')
            .default,
        })
      : require('../../layouts/UserLayout').default,
    routes: [
      {
        path: '/user',
        redirect: '/user/login',
        exact: true,
      },
      {
        path: '/user/login',
        name: 'login',
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import(/* webpackChunkName: 'p__User__models__register.js' */ 'G:/project/at0331/src/pages/User/models/register.js').then(
                  m => {
                    return { namespace: 'register', ...m.default };
                  },
                ),
              ],
              component: () =>
                import(/* webpackChunkName: "p__User__Login" */ '../User/Login'),
              LoadingComponent: require('G:/project/at0331/src/components/PageLoading/index')
                .default,
            })
          : require('../User/Login').default,
        exact: true,
      },
      {
        path: '/user/register',
        name: 'register',
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import(/* webpackChunkName: 'p__User__models__register.js' */ 'G:/project/at0331/src/pages/User/models/register.js').then(
                  m => {
                    return { namespace: 'register', ...m.default };
                  },
                ),
              ],
              component: () =>
                import(/* webpackChunkName: "p__User__Register" */ '../User/Register'),
              LoadingComponent: require('G:/project/at0331/src/components/PageLoading/index')
                .default,
            })
          : require('../User/Register').default,
        exact: true,
      },
      {
        path: '/user/register-result',
        name: 'register.result',
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import(/* webpackChunkName: 'p__User__models__register.js' */ 'G:/project/at0331/src/pages/User/models/register.js').then(
                  m => {
                    return { namespace: 'register', ...m.default };
                  },
                ),
              ],
              component: () =>
                import(/* webpackChunkName: "p__User__RegisterResult" */ '../User/RegisterResult'),
              LoadingComponent: require('G:/project/at0331/src/components/PageLoading/index')
                .default,
            })
          : require('../User/RegisterResult').default,
        exact: true,
      },
      {
        component: () =>
          React.createElement(
            require('G:/project/at0331/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: true },
          ),
      },
    ],
  },
  {
    path: '/exception',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "layouts__ExceptionLayout" */ '../../layouts/ExceptionLayout'),
          LoadingComponent: require('G:/project/at0331/src/components/PageLoading/index')
            .default,
        })
      : require('../../layouts/ExceptionLayout').default,
    routes: [
      {
        path: '/exception/403',
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import(/* webpackChunkName: 'p__Exception__models__error.js' */ 'G:/project/at0331/src/pages/Exception/models/error.js').then(
                  m => {
                    return { namespace: 'error', ...m.default };
                  },
                ),
              ],
              component: () =>
                import(/* webpackChunkName: "p__Exception__403" */ '../Exception/403'),
              LoadingComponent: require('G:/project/at0331/src/components/PageLoading/index')
                .default,
            })
          : require('../Exception/403').default,
        exact: true,
      },
      {
        path: '/exception/404',
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import(/* webpackChunkName: 'p__Exception__models__error.js' */ 'G:/project/at0331/src/pages/Exception/models/error.js').then(
                  m => {
                    return { namespace: 'error', ...m.default };
                  },
                ),
              ],
              component: () =>
                import(/* webpackChunkName: "p__Exception__404" */ '../Exception/404'),
              LoadingComponent: require('G:/project/at0331/src/components/PageLoading/index')
                .default,
            })
          : require('../Exception/404').default,
        exact: true,
      },
      {
        path: '/exception/500',
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import(/* webpackChunkName: 'p__Exception__models__error.js' */ 'G:/project/at0331/src/pages/Exception/models/error.js').then(
                  m => {
                    return { namespace: 'error', ...m.default };
                  },
                ),
              ],
              component: () =>
                import(/* webpackChunkName: "p__Exception__500" */ '../Exception/500'),
              LoadingComponent: require('G:/project/at0331/src/components/PageLoading/index')
                .default,
            })
          : require('../Exception/500').default,
        exact: true,
      },
      {
        path: '/exception/trigger',
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import(/* webpackChunkName: 'p__Exception__models__error.js' */ 'G:/project/at0331/src/pages/Exception/models/error.js').then(
                  m => {
                    return { namespace: 'error', ...m.default };
                  },
                ),
              ],
              component: () =>
                import(/* webpackChunkName: "p__Exception__TriggerException" */ '../Exception/TriggerException'),
              LoadingComponent: require('G:/project/at0331/src/components/PageLoading/index')
                .default,
            })
          : require('../Exception/TriggerException').default,
        exact: true,
      },
      {
        component: () =>
          React.createElement(
            require('G:/project/at0331/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: true },
          ),
      },
    ],
  },
  {
    path: '/',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "layouts__BasicLayout" */ '../../layouts/BasicLayout'),
          LoadingComponent: require('G:/project/at0331/src/components/PageLoading/index')
            .default,
        })
      : require('../../layouts/BasicLayout').default,
    Routes: [require('../Authorized').default],
    routes: [
      {
        path: '/',
        redirect: '/main/work',
        exact: true,
      },
      {
        path: '/main/work',
        name: '工作台',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__Workbench__Workbench" */ '../Workbench/Workbench'),
              LoadingComponent: require('G:/project/at0331/src/components/PageLoading/index')
                .default,
            })
          : require('../Workbench/Workbench').default,
        exact: true,
      },
      {
        path: '/main/work/opr/:oprKey',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__Main__ComOpr" */ '../Main/ComOpr'),
              LoadingComponent: require('G:/project/at0331/src/components/PageLoading/index')
                .default,
            })
          : require('../Main/ComOpr').default,
        routes: [
          {
            path: '/main/work/opr/:oprKey/ds',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "p__Main__Dataset__DatasetView" */ '../Main/Dataset/DatasetView'),
                  LoadingComponent: require('G:/project/at0331/src/components/PageLoading/index')
                    .default,
                })
              : require('../Main/Dataset/DatasetView').default,
            exact: true,
          },
          {
            path: '/main/work/opr/:oprKey/lb',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "p__Main__Dataset__LabelData" */ '../Main/Dataset/LabelData'),
                  LoadingComponent: require('G:/project/at0331/src/components/PageLoading/index')
                    .default,
                })
              : require('../Main/Dataset/LabelData').default,
            exact: true,
          },
          {
            path: '/main/work/opr/:oprKey/ml',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "p__Main__Model__ModelView" */ '../Main/Model/ModelView'),
                  LoadingComponent: require('G:/project/at0331/src/components/PageLoading/index')
                    .default,
                })
              : require('../Main/Model/ModelView').default,
            exact: true,
          },
          {
            path: '/main/work/opr/:oprKey/run',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "p__Main__Model__RunModel" */ '../Main/Model/RunModel'),
                  LoadingComponent: require('G:/project/at0331/src/components/PageLoading/index')
                    .default,
                })
              : require('../Main/Model/RunModel').default,
            exact: true,
          },
          {
            path: '/main/work/opr/:oprKey/vy',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "p__Main__Model__VerifyModel" */ '../Main/Model/VerifyModel'),
                  LoadingComponent: require('G:/project/at0331/src/components/PageLoading/index')
                    .default,
                })
              : require('../Main/Model/VerifyModel').default,
            exact: true,
          },
          {
            path: '/main/work/opr/:oprKey/deploy',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "p__Main__Model__Deploy" */ '../Main/Model/Deploy'),
                  LoadingComponent: require('G:/project/at0331/src/components/PageLoading/index')
                    .default,
                })
              : require('../Main/Model/Deploy').default,
            exact: true,
          },
          {
            path: '/main/work/opr/:oprKey/cte',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "p__Main__Model__CteModel" */ '../Main/Model/CteModel'),
                  LoadingComponent: require('G:/project/at0331/src/components/PageLoading/index')
                    .default,
                })
              : require('../Main/Model/CteModel').default,
            exact: true,
          },
          {
            path: '/main/work/opr/:oprKey/cteDs',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "p__Main__Dataset__CteDataset" */ '../Main/Dataset/CteDataset'),
                  LoadingComponent: require('G:/project/at0331/src/components/PageLoading/index')
                    .default,
                })
              : require('../Main/Dataset/CteDataset').default,
            exact: true,
          },
          {
            path: '/main/work/opr/:oprKey/lv',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "p__Main__Dataset__LabelView" */ '../Main/Dataset/LabelView'),
                  LoadingComponent: require('G:/project/at0331/src/components/PageLoading/index')
                    .default,
                })
              : require('../Main/Dataset/LabelView').default,
            exact: true,
          },
          {
            path: '/main/work/opr/:oprKey/upDs',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "p__Main__Dataset__UploadDataset" */ '../Main/Dataset/UploadDataset'),
                  LoadingComponent: require('G:/project/at0331/src/components/PageLoading/index')
                    .default,
                })
              : require('../Main/Dataset/UploadDataset').default,
            exact: true,
          },
          {
            path: '/main/work/opr/:oprKey/iv',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "p__Main__Dataset__ImageView" */ '../Main/Dataset/ImageView'),
                  LoadingComponent: require('G:/project/at0331/src/components/PageLoading/index')
                    .default,
                })
              : require('../Main/Dataset/ImageView').default,
            exact: true,
          },
          {
            path: '/main/work/opr/:oprKey/upImgDs',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "p__Main__Dataset__UploadImageDataset" */ '../Main/Dataset/UploadImageDataset'),
                  LoadingComponent: require('G:/project/at0331/src/components/PageLoading/index')
                    .default,
                })
              : require('../Main/Dataset/UploadImageDataset').default,
            exact: true,
          },
          {
            component: () =>
              React.createElement(
                require('G:/project/at0331/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        path: '/main/notebook',
        name: 'notebook',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__Notebook__Notebook" */ '../Notebook/Notebook'),
              LoadingComponent: require('G:/project/at0331/src/components/PageLoading/index')
                .default,
            })
          : require('../Notebook/Notebook').default,
        exact: true,
      },
      {
        component: () =>
          React.createElement(
            require('G:/project/at0331/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: true },
          ),
      },
    ],
  },
  {
    component: () =>
      React.createElement(
        require('G:/project/at0331/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
          .default,
        { pagesPath: 'src/pages', hasRoutesInConfig: true },
      ),
  },
];
window.g_routes = routes;
const plugins = require('umi/_runtimePlugin');
plugins.applyForEach('patchRoutes', { initialValue: routes });

export { routes };

export default class RouterWrapper extends React.Component {
  unListen() {}

  constructor(props) {
    super(props);

    // route change handler
    function routeChangeHandler(location, action) {
      plugins.applyForEach('onRouteChange', {
        initialValue: {
          routes,
          location,
          action,
        },
      });
    }
    this.unListen = history.listen(routeChangeHandler);
    // dva 中 history.listen 会初始执行一次
    // 这里排除掉 dva 的场景，可以避免 onRouteChange 在启用 dva 后的初始加载时被多执行一次
    const isDva =
      history.listen
        .toString()
        .indexOf('callback(history.location, history.action)') > -1;
    if (!isDva) {
      routeChangeHandler(history.location);
    }
  }

  componentWillUnmount() {
    this.unListen();
  }

  render() {
    const props = this.props || {};
    return (
      <RendererWrapper0>
        <Router history={history}>{renderRoutes(routes, props)}</Router>
      </RendererWrapper0>
    );
  }
}
