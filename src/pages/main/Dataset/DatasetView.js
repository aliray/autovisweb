import React, { Component,Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card,Divider,Button,Icon,Modal,Form,Table,Spin } from 'antd';

import styles from './opr.less';

@connect((state) => ({
  success: state.ds.success,
  error: state.ds.error,
  dslists:state.ds.dslists,
}))
class DatasetView extends Component{
  
	state = {
	    tabKey:'1',
	    selectedRows:[],
      oprKey:'',
      spinLoading:true,
	    columns:[ {
            title: 'ID',
            dataIndex: 'dataset_code',
            width:'100',
            key:'dataset_code',
            className:styles.columnSize
          },
          {
            title: '名称',
            dataIndex: 'dataset_name',
            width:'100',
            key: 'dataset_name',
            className:styles.columnSize
          },
          {
            title: '类型',
            width:'100',
            key: 'dataset_type',
            className:styles.columnSize,
            render:(text, record) => (this.showDsType(text, record))
          },
          {
            title: '分类数',
            dataIndex: 'label_amount',
            width:'100',
            className:styles.columnSize,
            key: 'label_amount',
          },
          {
            title: '图片数',
            dataIndex: 'images_amount',
            width:'100',
            key: 'images_amount',
            className:styles.columnSize
          },
          {
            title: '状态',
            dataIndex: 'dataset_status',
            width:'100',
            key: 'dataset_status',
            className:styles.columnSize
          },
          {
            title: '操作',
            width:'180px',
            key: 'opr',
            className:styles.columnSize,
            render: (text, record) => (this.oprBtn(text, record))
              
          },]

	}

  componentDidMount() {
    const { dispatch } = this.props;
    const oprKey = this.props.match.params.oprKey;
    this.setState({oprKey:oprKey});
  
    dispatch({
      type: 'ds/queryDsList',
      payload:{dataset_type:oprKey},
    });
    setTimeout(_=>{ 
      this.setState({spinLoading:false});
    },300);

  }

  oprBtn = (text, record) =>{
    const {oprKey} = this.state;
    if(oprKey == '0'){
      return <span>
            <a onClick={()=>this.skipLabelView(text, record)}>查看</a>
            <Divider type="vertical" />
            <a onClick={()=>this.uploadDs}>上传</a>
            <Divider type="vertical" />
            <a onClick={()=>this.deleteDataset(text, record)}>删除</a>
        </span>
    }else{
      return <span>
            <a onClick={()=>this.skipLabelView(text, record)}>查看</a>
            <Divider type="vertical" />
            <a onClick={()=>this.uploadDs}>上传</a>
            <Divider type="vertical" />
            <a onClick={()=>this.labelDs}>标注</a>
            <Divider type="vertical" />
            <a onClick={()=>this.deleteDataset(text, record)}>删除</a>
        </span>
    }
        
  }

  skipLabelView = (text, record) =>{
    const { dataset_id,dataset_name } = record;
    const {oprKey} = this.state;
    router.push('/main/work/opr/'+oprKey+'/lv',{dataset_id:dataset_id,dataset_name:dataset_name});
  }

  // 上传数据集
  uploadDs = () =>{
    
  }

  // 显示数据集类型
  showDsType = (text, record) =>{
    const { dataset_type } = record;
    let dataset_type_name = '';
    if(dataset_type=='0'){
      dataset_type_name = "图像分类";
    }else if(dataset_type=='1'){
      dataset_type_name = "物体检测";
    }else if(dataset_type=='2'){
      dataset_type_name = "图像分割";
    }else if(dataset_type=='3'){
      dataset_type_name = "关键点检测";
    }
    return <span>{dataset_type_name}</span>;
  }
  // 标注
  labelDs = () =>{
    const {oprKey} = this.state;
    router.push('/main/work/opr/'+oprKey+'/lb');
  }


  // 删除数据集
  deleteDataset = (text, record) =>{
    Modal.confirm({
      title: '删除数据集',
      content: '确定删除选中的数据集吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const { dispatch } = this.props;
        dispatch({
          type:'ds/rmDs',
          payload:record,
        });
      },
    });
   
  }

	//新增数据集
	addDataset = () =>{
	 const { oprKey } = this.state;
    router.push('/main/work/opr/'+oprKey+'/cteDs');
	}

	render(){
    const { dslists } = this.props;
    const loadingIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

		return(
			<div>
          <Spin spinning={this.state.spinLoading} indicator={loadingIcon}>
			    <div className={styles.menuDesc}>
			      <div className={styles.menuDescLeft}>数据集</div><div className={styles.menuDescRight}><a></a></div>
			      <Divider  />
			    </div> 
			    <div className={styles.detailArea}>
              <div style={{marginTop:'4px'}}>
                <div>
                  <Button type="primary" onClick={this.addDataset}>
                    新建数据集
                  </Button>
                </div>
                <div style={{marginTop:'16px'}}>
                  <Table rowKey="dataset_id" columns={this.state.columns} dataSource={dslists} />
                </div>
              </div>
			    </div>
          </Spin>
			</div>
		);
	}
}

export default  Form.create()(DatasetView);