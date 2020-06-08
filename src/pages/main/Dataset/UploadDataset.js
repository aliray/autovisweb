import { Component,Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Icon, Form, Upload, message, Divider,Spin } from 'antd';

import styles from './opr.less';

const FormItem = Form.Item;

// 数据集数据上传页面
@connect((state) => ({
  success: state.ds.success,
  error: state.ds.error,
}))
class UploadDatasetView extends Component{

	state = {
    fileList:[],
    dataset_id:'',
    dataset_name:'',
    dataset_type:''
	}

  componentDidMount() {
    const oprKey = this.props.match.params.oprKey;
    const { dataset_id,dataset_name } = this.props.location.state;

    this.setState({dataset_id:dataset_id,dataset_name:dataset_name,dataset_type:oprKey});

    setTimeout(_=>{ 
      this.setState({spinLoading:false});
    },300);

  }

  // 提交校验
  beforeUpload = file => {
 
    const { fileList } = this.state;
    
    const isFileLength = fileList.length == 0;
    if( !isFileLength ){
      message.error('只能上传1个文件');
      return false;
    }

    const isZip = file.type === 'application/x-zip-compressed';
    if(!isZip){
      message.error('请上传zip格式文件');
      return false;
    }
    const isLt2G = file.size / 1024 / 1024 / 1024 < 2;
    if (!isLt2G) {
      message.error('上传的zip压缩包不能大于2G!');
      return false;
    }

    console.log(file);

    this.setState({fileList:[file]});


    //return isFileLength && isLt2G && isZip;
    return false;
  }

  // 上传压缩包
  saveDataset = () =>{
    const { dataset_id,dataset_type,fileList,dataset_name } = this.state;
    const { dispatch,form } = this.props;
    console.log(fileList);
    dispatch({
      type:'ds/uploadDataset',
      payload:{zipfile:fileList[0],dataset_id:dataset_id,dataset_type:dataset_type,fileList:fileList}
    }).then(()=>{
      const { success,error } = this.props;
      if(success){
        router.push('/main/work/opr/'+dataset_type+'/lv',
          {dataset_id:dataset_id,dataset_name:dataset_name});
      }else{
        console.log(error);
      }
    })
  }

	render(){

    const { form: { getFieldDecorator } } = this.props;
    const { dataset_id,dataset_name,fileList } = this.state;

    const formItemLayout = {
           labelCol: {
          span: 3,
         },
         wrapperCol: {
          span: 6,
         },
    };

    // 更新上传进度
    const refreshFileProgress = fileList => {
      this.setState({
          fileList:fileList
      });
    }
    // 清空上传压缩包
    const setFileListEmpty = () =>{
      this.setState({
          fileList:[]
      });
    }
    //http://121.40.177.112/ds/upload/zip
		const uploadProps = {
	      name: 'zipfile',
        action: '/ds/upload/zip',
        headers: {
          accessControlAllowOrigin: "",
          accessControlAllowMethods: '*',
          accessControlAllowHeaders: 'x-requested-with,content-type',
          authorization: 'authorization-text',
        },
        data:{ 
          dataset_id: this.state.dataset_id,
          dataset_type: this.state.dataset_type,
        },
        fileList:this.state.fileList,
        onChange(info) {
          refreshFileProgress(info.fileList);
          if (info.file.status === 'done') {
            const success = info.file.response.success;
            if(success == 0){
              message.success('保存数据集成功');
              closeView();
            }else{
              message.error(info.file.response.error);
            }  
          } else if (info.file.status === 'error') {
            message.error(`${info.fileList[0].name} file upload failed.`);
          }
        },
        onRemove(info){
          setFileListEmpty();
        }
    };

    const loadingIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

		return(
			<div>
          <Spin spinning={this.state.spinLoading} indicator={loadingIcon}>
            <div className={styles.menuDesc}>
              <div className={styles.menuDescLeft}>数据集 {dataset_name!='' && <span>> {this.state.dataset_name}</span>}</div><div className={styles.menuDescRight}><a></a></div>
              <Divider  />
            </div> 
            <div className={styles.detailArea}>
  			     <Form {...formItemLayout}>
                <FormItem label="数据集名称" >               
                    <div style={{fontSize:'12px'}}>
                      {dataset_name}
                    </div>
                </FormItem>
                <FormItem label="上传压缩包">
                 {getFieldDecorator('zipfile')(
                    <Upload {...uploadProps} beforeUpload={this.beforeUpload}>
                      <Button style={{width:'235px'}}>
                        <Icon type="upload" />Upload
                      </Button>
                    </Upload>
                  )}
                 </FormItem>
                 <FormItem wrapperCol={{
                          xs: { span: 24, offset: 0 },
                          sm: {
                            span: formItemLayout.wrapperCol.span,
                            offset: formItemLayout.labelCol.span,
                          },
                           }}>
                          { fileList.length == 0 ?
                            <Button type="primary" disabled onClick={this.saveDataset}>确认并返回</Button>
                            :
                            <Button type="primary" onClick={this.saveDataset}>确认并返回</Button>
                          }
                      </FormItem>
                </Form>
  			    </div>
          </Spin>
      </div>
		);
	}
}


export default Form.create()(UploadDatasetView);