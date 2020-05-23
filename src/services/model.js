import { stringify } from 'qs';
import request from '@/utils/request';

// 获取模型
export function getModelList(params) {
  //return request(`/model/list?${stringify(params)}`);

  return request('/model/list', {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        body: stringify(params)
      });
}
// 保存模型
export function saveModel(params){
  //return request(`/model/create?${stringify(params)}`);

  return request('/model/create', {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        body: stringify(params)
      });
}
// 删除模型
export function deleteModel(params){
	console.log('----deleteModel------');
	//return request(`/model/rm?${stringify(params)}`);

	return request('/model/rm', {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        body: stringify(params)
      });
}

// 训练模型
export function drill(params){
	console.log('----drill------');
	return request('/model/drill', {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        body: stringify(params)
      });
}

// 获取训练
export function getDrillList(params){
  console.log('----getDrillList------');
  return request('/model/drill/list', {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        body: stringify(params)
      });
}