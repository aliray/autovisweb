import React, { Component,Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Divider,Button,List,Icon,Modal,Form,Table,Spin  } from 'antd';

import styles from './opr.less';

// 模型列表
@connect((state) => ({
  success: state.model.success,
  error: state.model.error,
  modelList: state.model.modelList,
  drillList: state.model.drillList,
}))
class ModelView extends Component{
	  state = {
      oprKey:'',
      spinLoading:true,
	  }

    componentDidMount() {
      
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
    // 跳转至新增模型页面
	  addModel = () =>{
      const { oprKey } = this.state;
	    router.push('/main/work/opr/'+oprKey+'/cte');
	  }
    // 删除模型
    deleteModel = model_id =>{
      Modal.confirm({
      title: '删除模型',
      content: '确定删除该的模型吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        console.log(model_id);
        const { dispatch } = this.props;
        const { oprKey } = this.state;
        dispatch({
          type:'model/deleteModel',
          payload:{model_id:model_id,model_type:oprKey}
        });
      },
    });
     
  }
  //训练模型
  runModel = modelDto =>{
    const { oprKey } = this.state;
    const { model_id } = modelDto;
    router.push('/main/work/opr/'+oprKey+'/run',{model_id:model_id});
  }
  //发布模型
  deployModel = () =>{
    const { oprKey } = this.state;
    router.push('/main/work/opr/'+oprKey+'/deploy');
  }
  //verifyModel 
  verifyModel = () =>{
    const { oprKey } = this.state;
    router.push('/main/work/opr/'+oprKey+'/vy');
  }
  //创建数据集
  cteDataset = () =>{
    const { oprKey } = this.state;
    router.push('/main/work/opr/'+oprKey+'/ds');
  }

	render(){

		const { oprKey } = this.state;
    const { form: { getFieldDecorator },modelList } = this.props;

    const columns = [{
            title: '部署方式',
            dataIndex: 'publish_type',
            className:styles.columnSize,
          },
          {
            title: '版本',
            dataIndex: 'version',
            className:styles.columnSize,
          },
          {
            title: '训练状态',
            dataIndex: 'drill_status',
            className:styles.columnSize,
          },
          {
            title: '模型效果',
            dataIndex: 'progress',
            className:styles.columnSize,
          },
          {
            title: '操作',
            className:styles.columnSize,
            render: (text, record) => (
              <span>
                <a onClick={()=>this.deployModel}>申请发布</a>
                <Divider type="vertical" />
                <a onClick={()=>this.verifyModel}>校验</a>
              </span>
            ),
    }];

    const loadingIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
		return(
			<div>
          <Spin spinning={this.state.spinLoading} indicator={loadingIcon}>
			    <div className={styles.menuDesc}>
			      <div className={styles.menuDescLeft}>我的模型</div>
			      <Divider />
			    </div>
			    <div style={{padding:'16px',fontSize:'12px'}}>
              <div>
                  <Button type="primary" style={{marginLeft:'10px'}} onClick={this.addModel}>
                      创建模型
                  </Button>
                  <div>
                    <List
                    itemLayout="vertical"
                    size="large"
                    pagination={{
                      onChange: page => {
                        console.log(page);
                      },
                      pageSize: 3,
                    }}
                    split={false}
                    dataSource={modelList}
                    footer={null}
                    renderItem={item => (
                      <List.Item
                        key={item.title}
                      >
                        <div style={{marginLeft:'10px',marginRight:'10px',
                           border:'1px solid #eee',fontSize:'12px'}}>
                          <div style={{backgroundColor:'#f7f7f7',lineHeight:'64px'}}>
                            <div style={{marginLeft:'10px',marginRight:'10px'}}>
                              【
                              {oprKey=='0' && <span>图像分类</span>} 
                              {oprKey=='1' && <span>物体检测</span>}
                              {oprKey=='2' && <span>图像分割</span>}
                              {oprKey=='3' && <span>关键点检测</span>}
                              】 {item.model_name} 模型ID：{item.model_id}
                              <div style={{float:'right'}}>
                                  <span style={{marginRight:'16px'}} >
                                    <Button type="link" onClick={()=>this.runModel(item)} style={{width:50}}>
                                      <Icon type="play-circle"/> 训练
                                    </Button>
                                  </span>
                                  <span > 
                                    <Button type="link" onClick={()=>this.deleteModel(item.model_id)} style={{width:60}}>
                                      <Icon type="delete"/> 删除 
                                    </Button>
                                  </span> 
                              </div>
                            </div>
                          </div>
                          <div style={{lineHeight:'80px',textAlign:'center'}}>
                              {
                                item.drillList == undefined ?
                                <span>模型创建成功，若无数据集请先在“数据中心”<a onClick={()=>this.cteDataset}>创建</a>，
                                上传训练数据<a onClick={()=>this.runModel(item)}>训练</a>模型后，可以在此处查看模型的最新版本</span>
                                :
                                <Table rowKey="drill_id" columns={columns} dataSource={item.drillList} pagination={false}/>
                              }
                          </div>
                        </div>
                      </List.Item>
                    )}
                  />
                  </div>
              </div>
			    </div>
          </Spin> 
			</div>
		);
	}
}

export default Form.create()(ModelView);