import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Row,Col,Divider,Button,Icon,Avatar,
	Empty,Form,Select,Table,Upload,Spin  } from 'antd';

import styles from './opr.less';

const FormItem = Form.Item;
const SelectOption = Select.Option;


function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}


@connect((state) => ({
  success: state.model.success,
  error: state.model.error,
  modelList:state.model.modelList,
}))
class VerifyModelView extends Component{

	state = {
		verify_status:'0',
		spinVisible:false,
		imageUrl:'',
		fileList:[],
		spinLoading:true,
		drillList:[],
		checkVerify:false,
		version:'',
	}

	componentDidMount() {
		const { dispatch } = this.props;
        const oprKey = this.props.match.params.oprKey;
	    this.setState({oprKey:oprKey});

	    this.loadModel(oprKey);

	    setTimeout(_=>{ 
	        this.setState({spinLoading:false});
	    },300);
	}

	// 获取模型数据
    loadModel = oprKey =>{
      const { dispatch } = this.props;
      dispatch({
        type: 'model/getModelList',
        payload: {model_type:oprKey}
      }).then(()=>{
        const { modelList } = this.props;
        if(modelList != undefined && modelList.length>0){
          dispatch({
            type: 'model/getDrillList',
            payload: {model_type:oprKey}
          }).then(()=>{
            const { drillList } = this.props;
            if(drillList != undefined && drillList.length>0){
              modelList.map(item=>{
                item.drillList = [];
                  drillList.map(dItem=>{
                    if(item.model_id==dItem.model_id){
                      item.drillList.push(dItem);
                    }
                  });
              });
            }
          });
        }
      });

    }

	// 选择模型
	chgModel = k =>{
		const { modelList } = this.props;
		const data = modelList.filter(item =>item.model_id == k);
		this.setState({drillList:data[0].drillList != undefined?data[0].drillList:[],
			 version:'',checkVerify:false,verify_status:'0'});
	}

	chgVersion = k =>{
		this.setState({checkVerify:true,version:k});
	}

	// 启动模型校验
	verifyModel = () =>{
		this.setState({verify_status:'1'});
	}

	//训练模型
    runModel = modelDto =>{
      console.log(modelDto);
      const { oprKey } = this.state;
      router.push('/main/work/opr/'+oprKey+'/run');
    }

    handleChange = info => {
	    if (info.file.status === 'uploading') {
	      this.setState({ loading: true });
	      return;
	    }
	    if (info.file.status === 'done') {
	      // Get this url from response in real world.
	      getBase64(info.file.originFileObj, imageUrl =>
	        this.setState({
	          imageUrl,
	          loading: false,
	        }),
	      );
	    }
	};

	deploy = () =>{
	  const { oprKey } = this.state;
      router.push('/main/work/opr/'+oprKey+'/deploy');
	}

	render(){

		const { form: { getFieldDecorator },modelList } = this.props;
		const { verify_status,spinVisible,imageUrl,drillList,checkVerify } = this.state;

		const formItemLayout = {
	        labelCol: {
	        span: 6,
	       },
	       wrapperCol: {
	        span: 16,
	       },
	       labelAlign:'left',
	    };
	    const getEmpDesc = () => {
	      return <div style={{color: '#969DA6'}}>暂无可用版本
	        <div style={{marginTop:'8px',fontSize:'12px'}}><a onClick={this.runModel}>去训练模型</a></div>
	      </div>;
	    }

	    const uploadButton = (
	      <Button>
	        上传图片
	      </Button>
	    );

	    const  columns = [
          {
            title: '分类',
            dataIndex: 'label',
          },
	        {
	          title: '准确率',
	          dataIndex: 'vm',
	        }];
	    const vData = [{
	    	label:'apple',
	    	vm:'99.00%',
	    },{
	    	label:'banana',
	    	vm:'1.00%',
	    }];
	    const uploadProps = {
	        name: 'image',
	        headers: {
	          accessControlAllowOrigin: "",
	          accessControlAllowMethods: '*',
	          accessControlAllowHeaders: 'x-requested-with,content-type',
	        },
	        fileList:this.state.fileList,
	        data:{         },
	    };
	    const loadingIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
		return(
			<div>
			   <Spin spinning={this.state.spinLoading} indicator={loadingIcon}>
			   <div className={styles.menuDesc}>
			      <div className={styles.menuDescLeft}>校验模型</div>
			      <Divider />
			    </div>
			    <div className={styles.detailArea}>
			        <div>
				        <Form layout="horizontal" {...formItemLayout}>
					      <Row>
					        <Col span={8}>
					          <FormItem label='选择模型'>
			                    {getFieldDecorator('model_id')(
			                       <Select placeholder="请选择模型" onChange={this.chgModel}> 
				                    {
					                 	modelList.map(item=>(
						                 	<SelectOption style={{fontSize:'12px' }} value={item.model_id}>
						                      {item.model_name}
						                    </SelectOption>
					                 	))
					                }
			                       </Select>
			                    )}
			                  </FormItem>
					        </Col>
					        <Col span={8}>
					          <FormItem label='部署方式'>
			                    {getFieldDecorator('deploy_way',{
			                    	initialValue:'1'
			                    })(
			                        <Select disabled> 
					                    <SelectOption style={{fontSize:'12px' }} value='1'>公有云部署(目前仅支持)</SelectOption>
				                    </Select>
			                    )}
			                  </FormItem>
					        </Col>
					        <Col span={8}>
					          <FormItem label='选择版本'>
			                    {getFieldDecorator('version')(
			                        <Select placeholder="请选择版本" onChange={this.chgVersion}> 
				                    {
					                 	drillList.map(item=>(
						                 	<SelectOption style={{fontSize:'12px' }} value={item.drill_id}>
						                      {item.version}
						                    </SelectOption>
					                 	))
					                }
			                       </Select>
			                    )}
			                  </FormItem>
					        </Col>
					      </Row>
					    </Form>
				    </div>
				    <div>
				      {
				      	(verify_status == '0' && checkVerify)&&
				      	<div style={{marginLeft:'80px',height:'200px'}}>
				      	  <Button type="primary" onClick={this.verifyModel}>启动模型校验服务</Button>
				      	</div>
				      }
				      {
				      	(verify_status == '0' && !checkVerify) &&
				      	<div>
				      	  <Empty description={getEmpDesc()} image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"/>
				      	</div>
				      }
				      {
				      	verify_status == '1' &&
				      	<div className={styles.vmmain} >
				            <div className={styles.vmleft}>
				              <div style={{border: '1px solid #eee',height:'400px',backgroundColor:'#f0f2f5'}}>
				                <div>
				                <Upload  
				                 name="avatar"
						        className="avatar-uploader"
						        showUploadList={false}
						        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
						        beforeUpload={beforeUpload}
						        onChange={this.handleChange}
                                 >
                                    {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: 640,height:400 }} /> : 
                                    <Button type="primary" style={{marginLeft:260,marginTop:180}}>上传图片</Button>}
					                
					             </Upload>
				                </div>
				                {!imageUrl &&
				                <div style={{marginLeft:180,marginTop:10}}>支持图片格式jpg、png,大小在4M以内</div>
				                }
				              </div>
				              <div style={{marginTop:'16px'}}>
				                <Upload  
				                 name="avatar1"
							        className="avatar-uploader"
							        showUploadList={false}
							        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
							        beforeUpload={beforeUpload}
							        onChange={this.handleChange}
                                 >
                                   <Button type="primary">点击添加图片</Button>
					             </Upload>
					            
					          </div>
				            
				            </div>
				            <div className={styles.vmright}>
				              <div style={{border: '1px solid #eee',height:'400px'}}>
				              <Table rowKey="label" columns={columns} dataSource={vData} pagination={false}/>
				              </div>
				              <div style={{marginTop:'16px'}}>
					            <Button type="primary" style={{width:120}} onClick={this.deploy}>申请上线</Button>
					          </div>
				            </div>

				        </div>
				      }
				    </div>
			    </div>
			    </Spin>
			</div>
		);
	}
}

export default Form.create()(VerifyModelView);