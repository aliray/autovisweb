import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card,Divider,Button,Icon,Empty,
  Form,Input,Select,Radio,Checkbox,Spin } from 'antd';

import styles from './opr.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const SelectOption = Select.Option;


@connect((state) => ({
  success: state.model.success,
  error: state.model.error,
  modelList:state.model.modelList,
}))
class Deploy extends Component{

	state = {
		deploy_type:'0',
		jc_type:'0',
		xz_type:'0',
		sf_type:'0',
		spinLoading:true,
		isDrill:'0',
		drillList:[],
	}

	componentDidMount() {
		const { dispatch } = this.props;
	    const oprKey = this.props.match.params.oprKey;
	    this.setState({oprKey:oprKey});
	    dispatch({
	        type: 'model/getModelList',
	        payload: {model_type:oprKey}
	    });
	    setTimeout(_=>{ 
	        this.setState({spinLoading:false});
	    },300);
	}
	// 选择模型
	chgModel = k =>{
		const { modelList } = this.props;
		const data = modelList.filter(item =>item.model_id == k);
		this.setState({isDrill:data[0].isDrill,drillList:data[0].drillList});
	}
	// 部署方式
	chgDeploy = k =>{
		this.setState({deploy_type:k});
	}
	// 集成方式
	chgJcType = k =>{
		this.setState({jc_type:k.target.value});
	}
	// 选择方案
	chgXzType = k =>{
		this.setState({xz_type:k.target.value});
	}
	// 跳转训练模型
    runModel = modelDto =>{
      const { oprKey } = this.state;
      router.push('/main/work/opr/'+oprKey+'/run');
    }
	render(){

		const { form: { getFieldDecorator },modelList } = this.props;
		const { deploy_type,isDrill,drillList } = this.state;
		const xzoptions = [
		  { label: 'EdgeBoard', value: '0' },
		  { label: '十目', value: '1' },
		]
		const formItemLayout = {
	        labelCol: {
	        span: 6,
	       },
	       wrapperCol: {
	        span: 18,
	       },
	    };

	    const getEmpDesc = () => {
	      return <div style={{color: '#969DA6'}}>暂无可发布版本
	        <div style={{marginTop:'8px',fontSize:'12px'}}><a onClick={this.runModel}> 去训练 </a></div>
	      </div>;
	    }
	    const loadingIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

		return(
			<div>
			    <Spin spinning={this.state.spinLoading} indicator={loadingIcon}>
			    <div className={styles.menuDesc}>
			      <div className={styles.menuDescLeft}>发布模型</div>
			      <div className={styles.menuDescRight}><a>如何部署</a></div>
			      <Divider />
			    </div>
			    <div style={{fontSize:'12px'}}>
			       <div style={{float:'left',minHeight:'360px',width:'50%',borderRight:'1px solid #f0f2f5'}}>
			          <div style={{marginTop:'20px'}}>
			              <Form {...formItemLayout}>
				                <FormItem label='选择模型'>
					                {getFieldDecorator('model_id')(
				                        <Select style={{width:'70%'}} placeholder="请选择模型" onChange={this.chgModel}> 
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
				                <FormItem label='部署方式'>
				                    {getFieldDecorator('deploy_type',{
				                    	initialValue:0
				                    })(
				                       <Select  style={{width:'70%'}} placeholder="部署方式" onChange={this.chgDeploy}>
				                            <SelectOption style={{fontSize:'12px' }} value={0} >公有云部署</SelectOption>
						                    <SelectOption style={{fontSize:'12px' }} value={1} >私有服务器部署</SelectOption>
						                    <SelectOption style={{fontSize:'12px' }} value={2} >设备端SDK</SelectOption>
						                    <SelectOption style={{fontSize:'12px' }} value={3} >软硬一体方案</SelectOption>
					                    </Select>
				                    )}
				                </FormItem>
				                {
			                	deploy_type=='1' &&
			                	<FormItem label='集成方式'>
			                    {getFieldDecorator('jc_type',{
			                       initialValue:0
			                    })(
			                      <Radio.Group style={{width:'70%'}} onChange={this.chgJcType} >
							        <Radio value={0}>私有API</Radio>
							        <Radio value={1}>服务器端SDK</Radio>
							      </Radio.Group>
			                    )}
			                </FormItem>
			                }
			                {
		                	deploy_type=='3' &&
		                	<FormItem label='选择方案'>
		                    {getFieldDecorator('xz_type',{
		                       initialValue:'0'
		                    })(
		                      <div style={{width:'70%'}}>
		                       <Radio.Group options={xzoptions} onChange={this.chgXzType} value={this.state.xz_type} /><a>了解更多</a>
		                      </div>
		                    )}
			                </FormItem>
			                }

			                {
			                	isDrill=='1' ?
			                	<div>
			                	 <FormItem label='选择版本'> 
				                    {getFieldDecorator('version')(
				                        <Select style={{width:'70%'}} placeholder="请选择版本"> 
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
				                <FormItem label='服务名称'>
				                    {getFieldDecorator('serve_type',{
				                    	rules: [
			                              {
			                                required: true,
			                                message: '请输入服务名称',
			                              },
			                            ],
				                    })(
				                       <Input style={{width:'70%'}}/>
				                    )}
				                </FormItem>
				                <FormItem label='接口地址'>
				                    {getFieldDecorator('dr',{
				                    	rules: [
			                              {
			                                required: true,
			                                message: '请输入接口地址',
			                              },
			                            ],
				                    })(
				                      <div>
				                       http://api.minibyte/v1/
				                       <Input style={{width:'52%'}}/>
				                      </div>
				                    )}
				                </FormItem>
				                <FormItem label='其他要求'>
				                    {getFieldDecorator('other')(
				                      <TextArea rows={4}  style={{width:'90%'}}
				                       placeholder="若接口无法满足您的需求，请描述希望解决的问题，500汉字以内。" />
				                    )}
				                </FormItem>
				                <FormItem wrapperCol={{
				                    xs: { span: 24, offset: 0 },
				                    sm: {
				                      span: formItemLayout.wrapperCol.span,
				                      offset: formItemLayout.labelCol.span,
				                    },
				                  }}>
				                  <div>
					               <div><Checkbox>同意云服务调用数据管理<a>服务条款</a>并开通服务</Checkbox></div>
					               <div><Button type="primary">提交申请</Button></div>
					              </div>
					             </FormItem>   
				                </div>
			                	:
			                	<div>
			                	  <Empty description={getEmpDesc()} image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"/>
			                	</div>
			                }


				        </Form>
			          </div>
			       </div>
			       <div style={{ padding:'20px',float:'right',width:'50%'}}>
			        {deploy_type =='0' &&  <div >
			            <div >说明</div>
						<div style={{ marginTop:'20px'}}>私有服务器部署支持将模型部署于本地的CPU、GPU服务器上，提供API和SDK两种集成方式：查看文档</div>
						<div style={{ marginTop:'20px'}}>私有API：将模型以Docker形式在本地服务器（仅支持Linux）上部署为http服务，
						可调用与公有云API功能相同的接口。可纯离线完成部署，服务调用便捷</div>
						<div style={{ marginTop:'20px'}}>服务器端SDK：将模型封装成适配本地服务器（支持Linux和Windows）的SDK，
						可集成在其他程序中运行。首次联网激活后即可纯离线运行，占用服务器资源更少，使用方法更灵活</div>
			         </div>}
			         {deploy_type =='1' &&  <div >
			            <div >说明</div>
						<div style={{ marginTop:'20px'}}>私有服务器部署支持将模型部署于本地的CPU、GPU服务器上，提供API和SDK两种集成方式：查看文档</div>
						<div style={{ marginTop:'20px'}}>私有API：将模型以Docker形式在本地服务器（仅支持Linux）上部署为http服务，
						可调用与公有云API功能相同的接口。可纯离线完成部署，服务调用便捷</div>
						<div style={{ marginTop:'20px'}}>服务器端SDK：将模型封装成适配本地服务器（支持Linux和Windows）的SDK，
						可集成在其他程序中运行。首次联网激活后即可纯离线运行，占用服务器资源更少，使用方法更灵活</div>
			         </div>}
			         {deploy_type =='2' &&
			         <div>
			            <div >说明</div>
						<div style={{ marginTop:'20px'}}>1. 设备端SDK支持Android、iOS、Windows、Linux操作系统，具体的系统、硬件环境支持请参考技术文档。
						提供可直接体验的移动端app安装包，以及相应代码包、说明文档，供企业用户/开发者二次开发</div>
						<div style={{ marginTop:'20px'}}>2. 如SDK生成失败，或有任何其他问题，欢迎加入QQ群咨询了解</div>
			         </div>
			         }
			         {deploy_type =='3' &&
			         <div>
			            <div >说明</div>
						<div style={{ marginTop:'20px'}}>1. 提交申请后会有工作人员在3个工作日之内联系，请确保手机畅通</div>
						<div style={{ marginTop:'20px'}}>2. 获取软硬一体方案流程如下：</div>
						<div style={{ marginTop:'20px'}}>

						Step 1：训练出效果满意的定制模型</div>
						<div style={{ marginTop:'20px'}}>

						Step 2：部署模型时，在了解不同方案的优势后，申请部署选定的方案，同时前往AI市场购买/申请测试</div>
						<div style={{ marginTop:'20px'}}>

						Step 3：获得硬件和用于激活专用SDK的专用序列号，将模型离线运行在硬件上</div>
						<div style={{ marginTop:'20px'}}>

						如有其他硬件方案需求，欢迎加入QQ群咨询了解</div>
			         </div>
			        }

			       </div>
			    </div>
			    </Spin>
			</div>
		);
	}
}

export default Form.create()(Deploy);