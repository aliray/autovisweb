import dva from 'dva';
import createLoading from 'dva-loading';

const runtimeDva = window.g_plugins.mergeConfig('dva');
let app = dva({
  history: window.g_history,
  
  ...(runtimeDva.config || {}),
});

window.g_app = app;
app.use(createLoading());
(runtimeDva.plugins || []).forEach(plugin => {
  app.use(plugin);
});

app.model({ namespace: 'global', ...(require('G:/project/dlcls_mock/src/models/global.js').default) });
app.model({ namespace: 'list', ...(require('G:/project/dlcls_mock/src/models/list.js').default) });
app.model({ namespace: 'login', ...(require('G:/project/dlcls_mock/src/models/login.js').default) });
app.model({ namespace: 'menu', ...(require('G:/project/dlcls_mock/src/models/menu.js').default) });
app.model({ namespace: 'modelTest', ...(require('G:/project/dlcls_mock/src/models/modelTest.js').default) });
app.model({ namespace: 'project', ...(require('G:/project/dlcls_mock/src/models/project.js').default) });
app.model({ namespace: 'setting', ...(require('G:/project/dlcls_mock/src/models/setting.js').default) });
app.model({ namespace: 'user', ...(require('G:/project/dlcls_mock/src/models/user.js').default) });
