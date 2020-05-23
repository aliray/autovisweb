import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card,Tabs,Button,List,Icon,Avatar,Empty,Modal,Form,Input,Tooltip } from 'antd';

import styles from './index.less';
import timgUrl from '@/assets/timg.jpg';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const { TextArea } = Input;
const { Search } = Input;

class notebookView extends Component {

  state = {
    tabKey:'1',
    notebookVisible:false,
    datasetVisible:false,

  }

  // 数据集和notebook页面切换
  callback = k =>{
      this.setState({tabKey:k});
  }

  //新增Notebook
  addNotebook = () =>{
    this.setState({notebookVisible:true});
  }

  //新增数据集
  addDataset = () =>{
    this.setState({datasetVisible:true});
  }
  // 保存notebook
  notebookSubmit = () =>{
     this.setState({notebookVisible:false});
  }

  // 关闭notebook新增页面
  notebookCancel = () =>{
     this.setState({notebookVisible:false});
  }

  // 数据集新增提交
  datasetSubmit = () =>{
    this.setState({datasetVisible:false});
  }
  //关闭数据集新增页面
  datasetCancel = () =>{
     this.setState({datasetVisible:false});
  }

  // 跳转数据集操作界面
  goDataset = key =>{
    router.push('/main/work/1/opr');
  }
  // 跳转模型操作界面
  goModel = key =>{
    router.push('/main/work/1/opr');
  }

  render() {
    const { form: { getFieldDecorator } } = this.props;
    const formItemLayout = {
         labelCol: {
        span: 24,
       },
       wrapperCol: {
        span: 24,
       },
    };


    const dmdata = [
      // {
      //   title: '模型1',
      //   desc:'模型介绍描述，，，，，，1'
      // },
      // {
      //   title: '模型2',
      //   desc:'模型介绍描述，，，，，，2'
      // },
      // {
      //   title: '模型3',
      //   desc:'模型介绍描述，，，，，，3'
      // }
    ];

    const data = [
      {
        title: '数据集1',
        dtype:'图像分类',
        desc:'数据集介绍描述，，，，，，1'
      },
      {
        title: '数据集2 ',
        dtype:'物体检测',
        desc:'数据集介绍描述，，，，，，2'
      },
      {
        title: '数据集3',
        dtype:'图像分割',
        desc:'数据集介绍描述，，，，，，3'
      },
      {
        title: '数据集4',
        dtype:'图像分类',
        desc:'数据集介绍描述，，，，，，4'
      },
    ];
    const dsFlag = data.length >0;
    const dmFlag = dmdata.length >0;

    const getDatasetEmpDesc = () => {
      return <div style={{fontSize: '12px',color: '#969DA6'}}>你还未创建任何数据集，点击<a> 创建数据集</a>!
        <p>无从下手？ 点击<a> 帮助文档 </a>了解更多</p>
      </div>;
    }

    const getModelEmpDesc = () => {
      return <div style={{fontSize: '12px',color: '#969DA6'}}>你还未创建任何notebook，点击<a> 创建notebook</a>!
        <p>无从下手？ 点击<a> 帮助文档 </a>了解更多</p>
      </div>;
    }

    const modelTabDesc = () =>{
      const { tabKey } = this.state;
      if( tabKey == 1){
         return <div><Tooltip title='notebook额度5，已用0'><Icon type="code-sandbox-square" theme="filled" /> notebook (0/5)</Tooltip></div>;
      }else{
        return <div><Tooltip title='notebook额度5，已用0'><Icon type="code-sandbox-square" theme="filled" /> notebook (0/5)</Tooltip></div>;
      }
    }

    const datasetTabDesc = () =>{
      const { tabKey } = this.state;
      if( tabKey == 2){
         return <div><Tooltip title='数据集额度10，已用4'><Icon type="database" theme="filled"/>数据集 (4/10)</Tooltip></div>;
      }else{
         return <div><Tooltip title='数据集额度10，已用4'><Icon type="database" theme="filled"/>数据集 (4/10)</Tooltip></div>;
      }
    }

    const getDesc = (dtype,desc) =>{
      return <div>{dtype}<p>{desc}</p></div>
    }
    return (
      <div>
          <div className={styles.pageMain}>
            <Card>
             <div className={styles.dataCard}>
              <Tabs defaultActiveKey="1" onChange={this.callback} 
                tabBarExtraContent={<div style={{marginRight:'20px',fontWeight:'bold'}}>剩余 2 小时 0 分钟<span style={{marginLeft:'10px'}}><Tooltip title='增加GPU使用时间'><Icon type="plus-circle"/></Tooltip></span></div>}>
                <TabPane tab={modelTabDesc()} key="1">
                  <div style={{padding:'16px 32px'}}>
                   <div style={{marginRight:'10px',float:'right'}}>
                    <Button type="primary" onClick={this.addNotebook}>
                      新增notebook
                    </Button>
                   </div>
                  </div>
                  <div style={{marginTop:'40px'}}>
                  { 
                    dmFlag ?
                    <List
                    itemLayout="horizontal"
                    dataSource={dmdata}
                    renderItem={item => (
                      <List.Item
                      actions={[<a key="list-loadmore-edit">编辑</a>,<a key="list-loadmore-del">删除</a>]}
                      >
                        <List.Item.Meta
                          avatar={<Avatar style={{width:60,height:60}} shape="square" src={timgUrl} />}
                          title={<a href="#" onClick={()=>this.goModel('1')}>{item.title}</a>}
                          description={item.desc}
                        />
                      </List.Item>
                    )}
                  />
                  : 
                   <div style={{marginTop:'180px',marginBottom:'180px'}}>
                      <Empty description={getModelEmpDesc()}/>
                   </div>
                  }
                  </div>
                </TabPane>
                <TabPane tab={datasetTabDesc()} key="2">
                  <div style={{padding:'16px 32px'}}>
                    <div>
                     <div style={{float:'left'}}>
                        <Search placeholder="输入关键字" />
                     </div>
                     <div style={{marginRight:'10px',float:'right'}}>
                      <Button type="primary" onClick={this.addDataset}>
                       新增数据集
                      </Button>
                     </div>
                    </div>
                    <div style={{marginTop:'40px'}}>
                    { 
                      dsFlag ?
                      <List
                      itemLayout="horizontal"
                      dataSource={data}
                      renderItem={item => (
                        <List.Item
                        actions={[<a key="list-loadmore-edit">编辑</a>,<a key="list-loadmore-del">删除</a>]}
                        >
                          <List.Item.Meta
                            avatar={<Avatar style={{width:70,height:70}} shape="square" src={timgUrl} />}
                            title={<a href="#" onClick={()=>this.goDataset('1')}>{item.title}</a>}
                            description={getDesc(item.dtype,item.desc)}
                          />
                        </List.Item>
                      )}
                    />
                    :
                      <Empty description={getDatasetEmpDesc()}/>
                    }
                    
                    </div>
                  </div>
                </TabPane>
               </Tabs>
              </div>
            </Card>
            <Modal
                title='新增notebook'
                width={600}
                visible={this.state.notebookVisible}
                okText='保存'
                onOk={ this.notebookSubmit } 
                onCancel={ this.notebookCancel }
                destroyOnClose
              >
              <Form {...formItemLayout}>
                <FormItem label='名称'>
                    {getFieldDecorator('notebook_name',{
                      rules: [
                              {
                                required: true,
                                message: '请输入名称',
                              },
                            ],
                    })(
                       <Input placeholder="请输入名称，不超过40个字符。" />
                    )}
                </FormItem>
                <FormItem label='描述'>
                    {getFieldDecorator('notebook_desc',{
                      rules: [
                              {
                                required: true,
                                message: '请输入描述',
                              },
                            ],
                    })(
                       <TextArea rows={4} placeholder="请简单描述你的notebook，不超过200个字符。" />
                    )}
                </FormItem>
              </Form>

          </Modal>
          <Modal
                title='新增数据集'
                width={650}
                visible={this.state.datasetVisible}
                okText='保存'
                onOk={ this.datasetSubmit } 
                onCancel={ this.datasetCancel }
                destroyOnClose
              >
               <Form {...formItemLayout}>
                <FormItem label='数据集名称'>
                    {getFieldDecorator('dataset_name',{
                      rules: [
                              {
                                required: true,
                                message: '请输入数据集名称',
                              },
                            ],
                    })(
                       <Input placeholder="请输入数据集名称，不超过40个字符。" />
                    )}
                </FormItem>
                <FormItem label='描述'>
                    {getFieldDecorator('dataset_desc',{
                      rules: [
                              {
                                required: true,
                                message: '请输入数据集描述',
                              },
                            ],
                    })(
                       <TextArea rows={4} placeholder="请简单描述你的数据集作用，不超过200个字符。" />
                    )}
                </FormItem>
              </Form>
            </Modal>
          </div>
          
        </div>
      );

  }
}

export default Form.create()(notebookView);
