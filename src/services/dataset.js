import { stringify } from 'qs';
import request from '@/utils/request';


// 创建数据集
export function create(params) {
  return request('/ds/create', {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        body: stringify(params)
      });
}
// 查询数据集
export function queryDsList(params) {
  return request('/ds/dslist', {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        body: stringify(params)
      });
}
// 删除数据集
export function rmDs(params) {
  return request('/ds/rm', {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        body: stringify(params)
      });
}

// 删除数据集
export function queryLabelList(params) {
  return request('/ds/label/list', {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        body: stringify(params)
      });
}

// 删除数据集
export function rmLabel(params) {

  return request('/ds/rm/label', {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        body: stringify(params)
      });
}

// 
export function uploadDataset(params) {

  let formData = new FormData();
  const fileList =  params.fileList;
  formData.append("zipfile", fileList[0].originFileObj);
  formData.append("dataset_id", params.dataset_id);
  formData.append("dataset_type", params.dataset_type);

  return request('/ds/upload/zip', {
        method: 'POST',
        body: formData
      });
}


export function uploadImageDataset(params) {

  let formData = new FormData();
  const fileList =  params.fileList;

  for(let i = 0 ;i<fileList.length;i++){
    //dataParament.files.fileList[i].originFileObj 这个对象是我观察 antd的Upload组件发现的里面的originFileObj 对象就是file对象
    formData.append('images',fileList[i].originFileObj);
  }

  formData.append("dataset_id", params.dataset_id);
  formData.append("dataset_type", params.dataset_type);
  formData.append("label", params.label);

  return request('/ds/upload/image', {
        method: 'POST',
        body: formData
      });
}

// 查询图片列表
export function queryImageList(params){
  return request('/ds/images/list', {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        body: stringify(params)
      });
}




