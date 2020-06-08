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

// 查询标签
export function queryLabelList(params) {
  return request('/ds/label/list', {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        body: stringify(params)
      });
}

// 通过输入标签名查询标签
export function queryLabel(params) {
  return request('/ds/queryLabel', {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        body: stringify(params)
      });
}

// 删除标签
export function rmLabel(params) {

  return request('/ds/rm/label', {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        body: stringify(params)
      });
}


// 删除标签
export function rmLabels(params) {

  return request('/ds/rm/labels', {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        body: stringify(params)
      });
}


// 删除图片
export function rmImage(params) {

  return request('/ds/rm/image', {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        body: stringify(params)
      });
}

// 删除多张图片
export function rmImages(params) {

  return request('/ds/rm/images', {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        body: stringify(params)
      });
}

// 上传压缩包 
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

// 上传图片
export function uploadImageDataset(params) {

  let formData = new FormData();
  const fileList =  params.fileList;

  for(let i = 0 ;i<fileList.length;i++){
    formData.append('images',fileList[i].originFileObj);
  }

  formData.append("dataset_id", params.dataset_id);
  formData.append("dataset_type", params.dataset_type);
  formData.append("label_name", params.label_name);

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




