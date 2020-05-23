import React, { Component,Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Row,Col,Divider,Button,Icon,Form,Input,Collapse,Spin } from 'antd';

import styles from './opr.less';

const FormItem = Form.Item;
const Panel = Collapse.Panel;

// 右侧描述
const DescView = () => (
  <Fragment>
    <Collapse bordered={false} accordion style={{fontSize:'12px'}}>
      <Panel header="如何设计分类" key="1">
        <p style={{ paddingLeft: 24 }}>每张图片都应该属于一个分类，一个模型最多支持1000个分类。</p>
        <p style={{ paddingLeft: 24 }}>分类需要以字母、数字或下划线命名，不支持中文。</p>
      </Panel>
      <Panel header="图片格式要求" key="2">
        <p style={{ paddingLeft: 24 }}>目前支持图片类型为png、jpg、bmp、jpeg，图片大小限制在4M以内。</p>
        <p style={{ paddingLeft: 24 }}>图片长宽比在3:1以内，其中最长边小于4096px，最短边大于30px。</p>
      </Panel>
      <Panel header="图片内容要求" key="3">
        <p style={{ paddingLeft: 24 }}>训练图片和实际场景要识别的图片拍摄环境一致，举例：如果实际要识别的图片是摄像头俯拍的，训练图片就不能用网上下载的目标正面图片。</p>
        <p style={{ paddingLeft: 24 }}>每个标签的图片需要覆盖实际场景里面的可能性，如拍照角度、光线明暗的变化，训练集覆盖的场景越多，模型的泛化能力越强。</p>
      </Panel>
      
    </Collapse>
  </Fragment>
);


@connect((state) => ({
  success: state.ds.success,
  error: state.ds.error,
}))
class CteDatasetView extends Component{
  
	state = {
      septype:'0',
      oprKey:'',
      spinLoading:true,
      dataset_name:'',
	}

  componentDidMount() {
    const { dispatch } = this.props;
    const oprKey = this.props.match.params.oprKey;
    this.setState({oprKey:oprKey});
    if(oprKey == '1'){
      this.setState({importWay:'0'}); 
    }
    setTimeout(_=>{ 
      this.setState({spinLoading:false});
    },300);

  }

  chgSeptype = e =>{
    this.setState({septype:e.target.value});
  }

  // 保存数据集
	saveDataset = () =>{
	    
      const { form,dispatch } = this.props;
      const { oprKey,septype } = this.state;

      form.validateFields((err,fieldsValue) => {
        console.log(fieldsValue);
        if(fieldsValue.dataset_name == undefined || fieldsValue.dataset_name == ''){
          return;
        }
        fieldsValue['dataset_type'] = oprKey;
        dispatch({
          type:'ds/create',
          payload:fieldsValue
        }).then(()=>{
          const { success,error } = this.props;
          if(success){
            router.push('/main/work/opr/'+oprKey+'/ds');
          }
        });
      });

	}

  chgDsName = e =>{
    console.log(e.target.value);
    this.setState({dataset_name:e.target.value});
  }

	render(){
		const { oprKey,septype,dataset_name  } = this.state;
    const { form: { getFieldDecorator }} = this.props;

    const formItemLayout = {
         labelCol: {
        span: 4,
       },
       wrapperCol: {
        span: 12,
       },
    };

    const loadingIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

		return(
			<div>
          <Spin spinning={this.state.spinLoading} indicator={loadingIcon}>
			    <div className={styles.menuDesc}>
			      <div className={styles.menuDescLeft}>创建数据集</div><div className={styles.menuDescRight}><a></a></div>
			      <Divider  />
			    </div>
			    <div className={styles.detailArea}>
            <div>
              <Row>
                <Col span={16}>
                  <div style={{marginTop:10}}>
                    <Form {...formItemLayout}>
                      <FormItem label='数据集名称'>
                          {getFieldDecorator('dataset_name')(
                             <Input placeholder="可输入最多20个字符" onChange={this.chgDsName}/>
                          )}
                      </FormItem>
                      <FormItem wrapperCol={{
                          xs: { span: 24, offset: 0 },
                          sm: {
                            span: formItemLayout.wrapperCol.span,
                            offset: formItemLayout.labelCol.span,
                          },
                           }}>
                          {(dataset_name =='') ?
                            <Button type="primary" disabled onClick={this.saveDataset}>确认并返回</Button>
                            :
                            <Button type="primary"  onClick={this.saveDataset}>确认并返回</Button>
                          }
                      </FormItem>
                     
                    </Form>
                  </div>
                </Col>
                <Col span={8}>
                   <div style={{ marginLeft: 20,marginBottom:10 }}>常见问题</div>
                   <DescView />
                </Col>
              </Row>
            </div>      
			    </div>
          </Spin>
			</div>
		);
	}
}

export default  Form.create()(CteDatasetView);