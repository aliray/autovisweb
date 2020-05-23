export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', name: 'login', component: './User/Login' },
      { path: '/user/register', name: 'register', component: './User/Register' },
      {
        path: '/user/register-result',
        name: 'register.result',
        component: './User/RegisterResult',
      }
    ],
  },
  // exception
  {
    path: '/exception',
    component: '../layouts/ExceptionLayout',
    routes: [
      {
        path: '/exception/403',
        component: './Exception/403',
      },
      {
        path: '/exception/404',
        component: './Exception/404',
      },
      {
        path: '/exception/500',
        component: './Exception/500',
      },
      {
        path: '/exception/trigger',
        component: './Exception/TriggerException',
      },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      // dashboard
      { path: '/', redirect: '/main/work' },
      {
          path: '/main/work',
          name:'工作台',
          component: './Workbench/Workbench'
      },
      {
          path: '/main/work/opr/:oprKey',
          component: './Main/ComOpr',
          routes:[
           {
            path: '/main/work/opr/:oprKey/ds',
            component: './Main/Dataset/DatasetView',
           },
           {
            path: '/main/work/opr/:oprKey/lb',
            component: './Main/Dataset/LabelData',
           },
           {
            path: '/main/work/opr/:oprKey/ml',
            component: './Main/Model/ModelView',
           },
           {
            path: '/main/work/opr/:oprKey/run',
            component: './Main/Model/RunModel',
           },
           {
            path: '/main/work/opr/:oprKey/vy',
            component: './Main/Model/VerifyModel',
           },
           {
            path: '/main/work/opr/:oprKey/deploy',
            component: './Main/Model/Deploy',
           },
           {
            path: '/main/work/opr/:oprKey/cte',
            component: './Main/Model/CteModel',
           },
           {
            path: '/main/work/opr/:oprKey/cteDs',
            component: './Main/Dataset/CteDataset',
           },
           {
            path: '/main/work/opr/:oprKey/lv',
            component: './Main/Dataset/LabelView',
           },
           {
            path: '/main/work/opr/:oprKey/upDs',
            component: './Main/Dataset/UploadDataset',
           },
           {
            path: '/main/work/opr/:oprKey/iv',
            component: './Main/Dataset/ImageView',
           },
            {
            path: '/main/work/opr/:oprKey/upImgDs',
            component: './Main/Dataset/UploadImageDataset',
           },
           
          ]
      },
      {
          path: '/main/notebook',
          name:'notebook',
          component: './Notebook/Notebook'
      },
      
    ],
  },


];
