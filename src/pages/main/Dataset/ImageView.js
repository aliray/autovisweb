import React, { Component,Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card,Divider,Button,Icon,Modal,Form,Table,Spin,Input } from 'antd';

import styles from './opr.less';

const { Search } = Input;


// 图片显示列表
@connect((state) => ({
  success: state.ds.success,
  error: state.ds.error,
  imageList:state.ds.imageList,
}))
class ImageView extends Component{
  
	state = {
	    tabKey:'1',
	    selectedRows:[],
      oprKey:'',
      spinLoading:true,
      searchValue:'',
      dataset_id:'',
      dataset_name:'',
      label_name:'',
	    columns:[ 
          {
            title: '图片名称',
            dataIndex: 'image_code',
            className:styles.columnSize,
          },
          {
            title: '操作',
            key: 'opr',
            className:styles.columnSize,
            render: (text, record) => (this.oprBtn(text, record))
          },]

	}

  componentDidMount() {
    const { dispatch } = this.props;
    const oprKey = this.props.match.params.oprKey;
    this.setState({oprKey:oprKey});

    const { dataset_id,dataset_name,label_name } = this.props.location.state;
    
    if(dataset_id != undefined){
      this.setState({dataset_id:dataset_id,dataset_name:dataset_name,label_name:label_name});
      dispatch({
        type: 'ds/queryImageList',
        payload:{dataset_type:oprKey,dataset_id:dataset_id,label_name:label_name,start:0,limit:20},
      });
    }
    setTimeout(_=>{ 
      this.setState({spinLoading:false});
    },300);

  }

  oprBtn = (text, record) =>{
    return <span>
            <a onClick={()=>this.deleteImage(text, record)}>删除</a>
        </span>  
  }

  // 上传数据集
  uploadImageDataset = () =>{
    const { dataset_id,dataset_name,oprKey,label_name } = this.state;
    console.log(this.state);
    router.push('/main/work/opr/'+oprKey+'/upImgDs',{dataset_id:dataset_id,dataset_name:dataset_name,label_name:label_name});
  }

  // 删除图片
  deleteImage = (text, record) =>{
    Modal.confirm({
      title: '删除图片',
      content: '确定删除选中的图片吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const { dispatch } = this.props;
        const { oprKey,dataset_id,label_name } = this.state;
        record.dataset_type = oprKey;
        record.dataset_id = dataset_id;
        record.label_name = label_name;
        dispatch({
          type:'ds/rmImage',
          payload:record,
        });
      },
    });
   
  }

  // 删除多个图片
  deleteImages = () =>{
    Modal.confirm({
      title: '删除图片',
      content: '确定删除选中所有图片吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const { dispatch } = this.props;
        const { oprKey,dataset_id,selectedRows,label_name } = this.state;

        var images = new Array();
        selectedRows.map(item=>{
          images.push(item.image_code);    
        });

        var record = {
          dataset_type:oprKey,
          dataset_id:dataset_id,
          images:images,
          label_name:label_name
        }
        dispatch({
          type:'ds/rmImages',
          payload:record,
        });
      },
    });
  }
  // 查询图片
	searchImage = v =>{

  }

	render(){
    const { imageList ,dataset_name,label_name } = this.props;
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
			      <div className={styles.menuDescLeft}>数据集 
            {dataset_name!='' && <span>> {this.state.dataset_name}</span>}
            {label_name!='' && <span>> {this.state.label_name}</span>}
            </div>
            <div className={styles.menuDescRight}><a></a></div>
			      <Divider  />
			    </div> 
			    <div className={styles.detailArea}>
              <div style={{marginTop:'4px'}}>
                <div>
                  <Button icon="plus" onClick={this.uploadImageDataset} style={{marginRight:8}}/>
                  {
                    selectedRows.length > 0 && <Button type='danger' style={{marginRight:8}}>删除</Button>
                  }
                  <Search style={{width:240}} placeholder="请输入图片名称查询" 
                   ref={input => this.searchValue = input} onSearch={value => this.searchImage(value)} />
                </div>
                <div style={{marginTop:'16px'}}>
                  <Table rowKey="image_code" rowSelection={rowSelection} columns={this.state.columns} dataSource={imageList} />
                </div>
              </div>
			    </div>
          </Spin>
			</div>
		);
	}
}

export default  Form.create()(ImageView);