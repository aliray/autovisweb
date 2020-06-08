import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Divider,Button,Icon,Form,Input,Select,Tooltip,Radio,Spin } from 'antd';

import styles from './opr.less';

const FormItem = Form.Item;
const { TextArea } = Input;

// 创建模型
@connect((state) => ({
  success: state.model.success,
  error: state.model.error,
}))
class CteModel extends Component{

	state = {
		affVue:'0',
		oprKey:'',
		spinLoading:true,
	}

	componentDidMount() {
	    console.log(this.props);
	    const oprKey = this.props.match.params.oprKey;
	    this.setState({oprKey:oprKey});
	    setTimeout(_=>{ 
	        this.setState({spinLoading:false});
	    },300);
	}

	// 保存模型
	nextSteps = () =>{

		const { form,dispatch } = this.props;
		const { oprKey } = this.state;
		let data;
		form.validateFields((err,fieldsValue) => {
			console.log(fieldsValue);
			if(err) return;
			data = fieldsValue;
			data['model_type'] = oprKey;
			//dva
			dispatch({
		        type: 'model/saveModel',
		        payload: data,
		    }).then(()=>{
		    	const { success,error } = this.props;
		    	if(success){
		    		router.push('/main/work/opr/'+oprKey+'/ml');
		    	}else{
		    		console.log(error);
		    	}
		    });
        });
	}

	chgAff = e =>{
		console.log(e.target.value);
		this.setState({affVue:e.target.value});
	}
	render(){

		const { form: { getFieldDecorator } } = this.props;
		const { affVue,oprKey } = this.state;
	    const formItemLayout = {
	         labelCol: {
	        span: 3,
	       },
	       wrapperCol: {
	        span: 12,
	       },
	    };

	    const loadingIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

		return(
			<div id="testC">
			    <Spin spinning={this.state.spinLoading} indicator={loadingIcon}>
			    <div className={styles.menuDesc}>
			      <div className={styles.menuDescLeft}><span>模型列表</span> > 创建模型</div>
			      <Divider />
			    </div>
			    <div style={{padding:'20px',fontSize:'12px'}}>
			      <div>
			         <Form {...formItemLayout}>
		                <FormItem label='模型类别'>  
		                       <div style={{fontSize:'12px'}}>
		                        {oprKey=='0' && <span>图像分类</span>} 
		                        {oprKey=='1' && <span>物体检测</span>}
		                        {oprKey=='2' && <span>图像分割</span>}
		                        {oprKey=='3' && <span>声音分类</span>}
		                       </div>
		                </FormItem>
		                <FormItem label='模型名称'>
		                    {getFieldDecorator('model_name',{
		                      rules: [
		                              {
		                                required: true,
		                                message: '请输入模型名称',
		                              },
		                            ],
		                    })(
		                       <Input style={{width:'80%'}}/>
		                    )}
		                </FormItem>
		                <FormItem label='业务类型'>
		                    {getFieldDecorator('model_biztype',{
		                      rules: [
		                              {
		                                required: true,
		                                message: '请选择业务类型',
		                              },
		                            ],
		                    })(
		                      <Select style={{ width: '80%' }} placeholder="请选择业务类型">
                                <Select.Option value="0">教育培训</Select.Option>
                                <Select.Option value="1">文化娱乐</Select.Option>
                                <Select.Option value="2">视频直播</Select.Option>
                                <Select.Option value="3">游戏</Select.Option>
                                <Select.Option value="4">交通出行</Select.Option>
                                <Select.Option value="5">电子商务</Select.Option>
                                <Select.Option value="6">金融</Select.Option>
                                <Select.Option value="7">零售</Select.Option>
                                <Select.Option value="8">酒店旅游</Select.Option>
                                <Select.Option value="9">企业服务</Select.Option>
                                <Select.Option value="10">物流货运</Select.Option>
                                <Select.Option value="11">生活服务</Select.Option>
                                <Select.Option value="12">医疗健康</Select.Option>
                                <Select.Option value="13">房产家装</Select.Option>
                                <Select.Option value="14">商业地产</Select.Option>
                                <Select.Option value="15">智能硬件</Select.Option>
                                <Select.Option value="16">制造业</Select.Option>
                                <Select.Option value="17">农业</Select.Option>
                                <Select.Option value="18">法律政务</Select.Option>
                                <Select.Option value="19">安防监控</Select.Option>
                                <Select.Option value="20">软件工具</Select.Option>
                                <Select.Option value="21">智能手机</Select.Option>
                                <Select.Option value="22">其他</Select.Option>
                              </Select>
		                    )}
		                </FormItem>
		                <FormItem label='应用场景'>
		                    {getFieldDecorator('model_apptype',{
		                      rules: [
		                              {
		                                required: true,
		                                message: '请选择应用场景',
		                              },
		                            ],
		                    })(
		                      <Select style={{ width: '80%' }} placeholder="请选择行业">
                                <Select.Option value="0">在视频监控场景下，识别出指定行为/现象/物体</Select.Option>
                                <Select.Option value="1">为批量图片自动打标签</Select.Option>
                                <Select.Option value="2">图片审核，判断当前图片是否符合定制的标准</Select.Option>
                                <Select.Option value="3">工业生产线质检/自动分拣</Select.Option>
                                <Select.Option value="4">其他</Select.Option>
                              </Select>
		                    )}
		                </FormItem>
		                <FormItem label='邮箱地址'>
		                    {getFieldDecorator('email',{
		                      rules: [
		                              {
		                                required: true,
		                                message: '请输入邮箱地址',
		                              },
		                            ],
		                    })(
		                       <Input placeholder="请输入邮箱地址。" style={{width:'80%'}}/>
		                    )}
		                </FormItem>
		                <FormItem label='联系电话'>
		                    {getFieldDecorator('phone',{
		                      rules: [
		                              {
		                                required: true,
		                                message: '请输入联系方式',
		                              },
		                            ],
		                    })(
		                       <div>
		                       <Input placeholder="请输入联系电话。" style={{width:'80%'}}/>
		                       <span style={{marginLeft:'8px'}}>
		                       <Tooltip title='有效的联系方式将有助于后续模型上线的人工快速审核、发布和应用。'>
		                       <Icon type="question-circle"/></Tooltip>
		                       </span>
		                       </div>
		                    )}
		                </FormItem>
		                <FormItem label='功能描述'>
		                    {getFieldDecorator('descripts',{
		                        rules: [
		                              {
		                                required: true,
		                                message: '请输入功能描述',
		                              },
		                            ],
		                    })(
		                       <TextArea rows={8} placeholder="请简单描述你的模型作用，不超过500个字符。" />
		                    )}
		                </FormItem>
		                 <FormItem wrapperCol={{
		                    xs: { span: 24, offset: 0 },
		                    sm: {
		                      span: formItemLayout.wrapperCol.span,
		                      offset: formItemLayout.labelCol.span,
		                    },
		                  }}>
			              <Button type="primary" onClick={()=>this.nextSteps()}>下一步</Button>
			            </FormItem>     
		              </Form>
			      </div>
			    </div>
			    </Spin>
			</div>
		);
	}
}

export default Form.create()(CteModel);