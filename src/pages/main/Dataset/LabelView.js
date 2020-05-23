import React, { Component,Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card,Divider,Button,Icon,Modal,Form,Table,Spin,Input } from 'antd';

import styles from './opr.less';

const { Search } = Input;

@connect((state) => ({
  success: state.ds.success,
  error: state.ds.error,
  labelList:state.ds.labelList,
}))
class LabelView extends Component{
  
	state = {
	    tabKey:'1',
	    selectedRows:[],
      oprKey:'',
      spinLoading:true,
      searchValue:'',
      dataset_id:'',
      dataset_name:'',
	    columns:[ 
          {
            title: '标签名称',
            dataIndex: 'label_name',
            width:'100',
            className:styles.columnSize
          },
          {
            title: '图片数量',
            dataIndex: 'images_size',
            width:'100',
            className:styles.columnSize,
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

    const { dataset_id,dataset_name } = this.props.location.state;
    console.log(dataset_id);
    if(dataset_id != undefined){
      this.setState({dataset_id:dataset_id,dataset_name:dataset_name});
      dispatch({
        type: 'ds/queryLabelList',
        payload:{dataset_type:oprKey,dataset_id:dataset_id},
      });
    }
    setTimeout(_=>{ 
      this.setState({spinLoading:false});
    },300);

  }

  skipImageView = (text, record) =>{
    const {oprKey,dataset_id,dataset_name} = this.state;
    const { label_name } = record;
    router.push('/main/work/opr/'+oprKey+'/iv',
      {dataset_id:dataset_id,dataset_name:dataset_name,label_name:label_name}
    );
  }

  oprBtn = (text, record) =>{
    return <span>
            <a onClick={()=>this.skipImageView(text, record)}>查看</a>
            <Divider type="vertical" />
            <a onClick={()=>this.deleteLabel(text, record)}>删除</a>
        </span>  
  }

  // 上传数据集
  uploadDs = () =>{
    const { dataset_id,dataset_name,oprKey } = this.state;
    router.push('/main/work/opr/'+oprKey+'/upDs',{dataset_id:dataset_id,dataset_name:dataset_name});
  }

  // 删除单个标签
  deleteLabel = (text, record) =>{

    Modal.confirm({
      title: '删除标签',
      content: '确定删除选中的标签吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const { dispatch } = this.props;
        const {oprKey,dataset_id} = this.state;
        record.dataset_type = oprKey;
        record.dataset_id = dataset_id;
        dispatch({
          type:'ds/rmLabel',
          payload:record,
        });
      },
    });
   
  }

  // 删除多个标签
  deleteLabels = () =>{
    Modal.confirm({
      title: '删除标签',
      content: '确定删除选中所有标签吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const { dispatch } = this.props;
        const { selectedRows } = this.state;

       
      },
    });
  }
  // 查询标签
	searchLabels = v =>{

  }

	render(){
    const { labelList,dataset_name } = this.props;
    const { selectedRows } = this.state;

    const loadingIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        this.setState({selectedRows});
      },
      onSelect: (record, selected, selectedRows) => {
        console.log(record, selected, selectedRows);
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        console.log(selected, selectedRows, changeRows);
      },
    };


		return(
			<div>
          <Spin spinning={this.state.spinLoading} indicator={loadingIcon}>
			    <div className={styles.menuDesc}>
			      <div className={styles.menuDescLeft}>数据集 {dataset_name!='' && <span>> {this.state.dataset_name}</span>}</div><div className={styles.menuDescRight}><a></a></div>
			      <Divider  />
			    </div> 
			    <div className={styles.detailArea}>
              <div style={{marginTop:'4px'}}>
                <div>
                  <Button icon="plus" onClick={this.uploadDs} style={{marginRight:8}}/>
                  {
                    selectedRows.length > 0 && <Button type='danger' style={{marginRight:8}} onClick={this.deleteLabels}>删除</Button>
                  }
                  <Search style={{width:240}} placeholder="请输入标签名称查询" 
                   ref={input => this.searchValue = input} onSearch={value => this.searchLabels(value)} />
                </div>
                <div style={{marginTop:'16px'}}>
                  <Table rowKey="label_name" rowSelection={rowSelection} columns={this.state.columns} dataSource={labelList} />
                </div>
              </div>
			    </div>
          </Spin>
			</div>
		);
	}
}

export default  Form.create()(LabelView);