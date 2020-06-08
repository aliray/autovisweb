import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Divider,Button,Icon,Form,Input,Select,Tooltip,Radio,Spin } from 'antd';

import styles from './opr.less';

const FormItem = Form.Item;
const SelectOption = Select.Option;


// 训练模型
@connect((state) => ({
  success: state.model.success,
  error: state.model.error,
  modelList:state.model.modelList,
  dslists:state.ds.dslists,
}))
class RunModelView extends Component{

	state = {
		oprKey:'',
		spinLoading:true,
		checkGo:false,
		publish_type:'0',
		dataset_id:'',
		model_id:'',
	}

	componentDidMount() {
        const { dispatch } = this.props;
        const oprKey = this.props.match.params.oprKey;
	    this.setState({oprKey:oprKey});

        dispatch({
	      type: 'model/getModelList',
	      payload: {model_type:oprKey}
	    });

        dispatch({
	      type: 'ds/queryDsList',
	      payload:{dataset_type:oprKey},
	    });

	    setTimeout(_=>{ 
	        this.setState({spinLoading:false});
	    },300);

    }

    // 选择模型
	chgModel = k =>{
		this.setState({model_id:k});
		this.checkGo('m');
	}

	// 选择数据集
	chgDataset = k =>{
		this.setState({dataset_id:k})
		this.checkGo('d');
	}
	//部署方式
	chgPublishType = e =>{
		this.setState({publish_type:e.target.value});
	}

	// 控制启动训练按钮是否可点击
	checkGo = f =>{
		const { model_id,dataset_id } = this.state;
		if(f=='m' && dataset_id!=''){
			this.setState({checkGo:true});
		}

		if(f=='d' && model_id!=''){
			this.setState({checkGo:true});
		}
	}
	
	//开始训练
	startRun = () =>{
		const { oprKey } = this.state;
		const { dispatch,form } = this.props;
		form.validateFields((err,fieldsValue) => {
			let data = fieldsValue;
			data.model_type = oprKey;

			// 测试使用
			data.model_code = '001';
			data.version = 1;
			data.publish_type = '0';

			dispatch({
				type:'model/drill',
				payload:data
			}).then(()=>{
				const { success,error } = this.props;
				if(success == '0'){
					router.push('/main/work/opr/'+oprKey+'/ml');
				}
			});
		});
	}

	render(){

		const { form: { getFieldDecorator },modelList,dslists } = this.props;
		const { checkGo } = this.state;

	    const formItemLayout = {
	        labelCol: {
	        span: 2,
	       },
	       wrapperCol: {
	        span: 16,
	       },
	       labelAlign:'left',
	    };

	    const options = [
		  { label: '公有云部署', value: '0' },
		];

	    const loadingIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
		return(
			<div >
			   <Spin spinning={this.state.spinLoading} indicator={loadingIcon}>
			   <div className={styles.menuDesc}>
			      <div className={styles.menuDescLeft}>训练模型</div>
			      <div className={styles.menuDescRight}><a>攻略帖</a></div>
			      <Divider />
			    </div>
			    <div className={styles.detailArea}>
			      <div>
			         <Form {...formItemLayout}>
		                <FormItem label='选择模型'>
		                    {getFieldDecorator('model_id')(
		                        <Select style={{width:'36%'}} placeholder="请选择模型" onChange={this.chgModel}> 
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
		                <FormItem label='数据集'>
		                    {getFieldDecorator('dataset_id')(
		                        <Select style={{width:'36%'}} placeholder="请选择数据集" onChange={this.chgDataset}> 
				                     {
					                 	dslists.map(item=>(
						                 	<SelectOption style={{fontSize:'12px' }} value={item.dataset_id}>
						                      {item.dataset_name}
						                    </SelectOption>
					                 	))
					                 }
			                    </Select>
		                    )}
		                </FormItem>
		                <FormItem label='部署类型'>
		                    {getFieldDecorator('publish_type',{
		                      initialValue:'0',
		                    })(
		                       <Radio.Group options={options}  value={this.state.publish_type} onChange={this.chgPublishType}/>
		                    )}
		                </FormItem>
		                <FormItem label='选择算法'>
		                    {getFieldDecorator('algorithm_type',{
		                      initialValue:0,
		                    })(
		                      <Radio.Group >
						        <Radio value={0}>高精度
						        <span style={{marginLeft:'8px'}}>
		                       <Tooltip title='拥有相对更高的准确率，但模型体积大，响应相对较慢'>
		                       <Icon type="question-circle"/></Tooltip>
		                       </span>
						        </Radio>
						        <Radio value={1}>高性能
						           <span style={{marginLeft:'8px'}}>
				                       <Tooltip title='拥有毫秒级响应的性能，模型体积小，但准确率有所降低'>
				                         <Icon type="question-circle"/>
				                       </Tooltip>
			                       </span>
						        </Radio>
						      </Radio.Group>
		                    )}
		                </FormItem>
		                
		                <FormItem wrapperCol={{
		                    xs: { span: 24, offset: 0 },
		                    sm: {
		                      span: formItemLayout.wrapperCol.span,
		                      offset: formItemLayout.labelCol.span,
		                    },
		                  }}>
		                  { checkGo ?
		                  	<Button type="primary" onClick={()=>this.startRun()}>开始训练</Button>
		                  	:
		                  	<Button type="primary" disabled onClick={()=>this.startRun()}>开始训练</Button>
		                  }
			              
			            </FormItem>
		              </Form>
			      </div>
			    </div>
			    </Spin>
               
			</div>
		);
	}
}

export default  Form.create()(RunModelView);