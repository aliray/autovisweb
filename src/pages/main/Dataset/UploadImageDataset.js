import { Component,Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Icon, Form, Upload, message, Divider,Spin } from 'antd';

import styles from './opr.less';

const FormItem = Form.Item;

@connect((state) => ({
  success: state.ds.success,
  error: state.ds.error,
}))
class UploadImageDatasetView extends Component{

	state = {
	    fileList:[],
	    dataset_id:'',
	    dataset_name:'',
	    dataset_type:'',
	    label:'',
	}

	componentDidMount() {
	    const oprKey = this.props.match.params.oprKey;
	    const { dataset_id,dataset_name,label } = this.props.location.state;

	    this.setState({dataset_id:dataset_id,
	    	dataset_name:dataset_name,
	    	dataset_type:oprKey,
	    	label:label
	    });

	    setTimeout(_=>{ 
	      this.setState({spinLoading:false});
	    },300);

	}

	// 提交校验
	beforeUpload = file => {
	 
	    const { fileList } = this.state;
	     
	    const isZip = file.type === 'image/jpeg';
	    if(!isZip){
	      message.error('请上传图片');
	      return false;
	    }
	    const isLt2G = file.size / 1024 / 1024 < 10;
	    console.log(file.size);
	    if (!isLt2G) {
	      message.error('上传的z图片不能大于10M!');
	      return false;
	    }
	    console.log(file);

	    this.setState({fileList:[...fileList,file]});
	    //return isFileLength && isLt2G && isZip;
	    return false;
	}

	//
	saveDataset = () =>{
	    const { dataset_id,dataset_type,fileList,label } = this.state;
	    const { dispatch,form } = this.props;
	    console.log(fileList);
	    
	    dispatch({
	      type:'ds/uploadImageDataset',
	      payload:{
	      	dataset_id:dataset_id,
	      	dataset_type:dataset_type,
	      	fileList:fileList,
	      	label:label
	      }
	    }).then(()=>{
	    	const { success,error } = this.props;
		    if(success){
		    	router.push('/main/work/opr/'+dataset_type+'/iv',
			      {dataset_id:dataset_id,dataset_name:dataset_name,label:label}
			    );
		    }else{
		        console.log(error);
		    }
	    })
	}

	render(){

	    const { form: { getFieldDecorator } } = this.props;
	    const { dataset_id,dataset_name,fileList,label } = this.state;

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
		    name: 'images',
	        action: '/ds/upload/image',
	        headers: {
	          accessControlAllowOrigin: "",
	          accessControlAllowMethods: '*',
	          accessControlAllowHeaders: 'x-requested-with,content-type',
	          authorization: 'authorization-text',
	        },
	        data:{ 
	          dataset_id: this.state.dataset_id,
	          dataset_type: this.state.dataset_type,
	          label:this.state.label,
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
		              <div className={styles.menuDescLeft}>数据集 
		              {dataset_name!='' && <span>> {this.state.dataset_name}</span>}
		              {label!='' && <span>> {this.state.label}</span>}
		              </div><div className={styles.menuDescRight}><a></a></div>
		              <Divider  />
		            </div> 
		            <div className={styles.detailArea}>
		  			    <Form {...formItemLayout}>
			                <FormItem label="数据集名称" >               
			                    <div style={{fontSize:'12px'}}>
			                      {dataset_name}
			                    </div>
			                </FormItem>
			                <FormItem label="标签" >               
			                    <div style={{fontSize:'12px'}}>
			                      {label}
			                    </div>
			                </FormItem>
			                <FormItem label="上传图片">
				                {getFieldDecorator('zipfile')(
				                    <Upload multiple {...uploadProps} beforeUpload={this.beforeUpload}>
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


export default Form.create()(UploadImageDatasetView);

