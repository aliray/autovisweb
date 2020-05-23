import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Menu,Row,Col,Card,Icon,Avatar } from 'antd';

import styles from './comOpr.less';

import bananaUrl from '@/assets/xiangjiao.jpg';
import objDetectUrl from '@/assets/detect.jpg';

class ComOpr extends Component {

  state = {
    colkey:'1',
    oprKey:'',
  }

  constructor(props) {
    super(props);
    this.state = {
      mode: 'inline',
      selectKey: 'ds',
    };
  }

  componentDidMount() {
    const oprKey = this.props.match.params.oprKey;
    this.setState({oprKey:oprKey});
  }

  // 页面切换
  selectKey = ({ key }) => {
    const { oprKey } = this.state;
    router.push(`/main/work/opr/${oprKey}/${key}`);
    this.setState({
      selectKey: key,
    });
  };
  // 模块介绍伸缩
  colDetail = key =>{
    this.setState({colkey:key});
  }
  
  render() {
    const { selectKey,colkey,oprKey } = this.state;
    const { children } = this.props;

    return (
        <div>
          <div className={styles.pageMain}>
            <div style={{marginBottom:'24px'}}>
              { colkey=='1'?
                  <Card>
                      <div>
                        <div className={styles.themeDesc}>
                          {oprKey=='0' && <span>图像分类模型</span>} 
                          {oprKey=='1' && <span>物体检测模型</span>}
                          {oprKey=='2' && <span>图像分割模型</span>}
                          {oprKey=='3' && <span>关键点检测模型</span>}     
                        </div>
                        <div className={styles.headline}><span ><a>操作文档</a></span><span><a>常见问题</a></span></div>
                        <div className={styles.headOpr} onClick={()=>this.colDetail('2')}>展开  <Icon type="down" /></div>
                      </div>
                  </Card>
                  :
                  <Card>
                    <div>
                     <div className={styles.headImg}>
                        {oprKey=='0' ? <Avatar shape="square" className={styles.imgSize} src={bananaUrl} />
                        : <Avatar shape="square" className={styles.imgSize} src={objDetectUrl} />
                        }   
                     </div>
                     <div className={styles.headDesc}>
                        <div className={styles.themeDesc}>
                          {oprKey=='0' && <span>图像分类模型</span>} 
                          {oprKey=='1' && <span>物体检测模型</span>}
                          {oprKey=='2' && <span>图像分割模型</span>}
                          {oprKey=='3' && <span>关键点检测模型</span>}
                        </div>
                       <div className={styles.headline}><span><a>操作文档</a></span><span><a>常见问题</a></span></div>
                       <div className={styles.headOpr} onClick={()=>this.colDetail('1')}>收起  <Icon type="up" /></div>
                       <div style={{marginTop:'40px'}}>
                         <div style={{width:'100%'}}>
                            {oprKey=='0' && <span>定制图像分类模型，可以识别一张图整体是什么物体/状态/场景，训练集图片需要和实际场景要识别的图片环境一致。</span>}
                            {oprKey=='1' &&<span>定制物体检测模型，可以检测出图片里面的所有目标物体名称、位置。适用于一张图片中要识别多个物体，物体计数等场景中。</span>}
                            {oprKey=='2' && <span>定制图像分割模型，在图中包含多个目标时，识别每个目标的名称、位置（像素级），按目标名称计数。适合图中有多个目标、</span>}
                            {oprKey=='3' && <span>定制关键点检测模型，可以定制识别出当前图片关键点检测位置、大小区域。</span>}
                          </div>
                         <div>
                            {oprKey=='0' && <span>每个标签的图片需要覆盖实际场景里面的可能性，如拍照角度、光线明暗的变化 ，训练集覆盖的场景越多，模型的泛化能力越强。</span>}
                            {oprKey=='1' && <span>在各检测物体之间差异明显的情况下，训练数据每个标签仅需覆盖20-100张图片，训练时间可能需要30分钟以上。</span>}
                            {oprKey=='2' && <span>需用多边形标注或需识别目标轮廓的场景。训练数据每个标签需覆盖20-100张图片，训练时间可能需要30分钟以上</span>}
                            {oprKey=='3' && <span>训练数据每个标签大致需要50个以上图片，训练数据每个标签需覆盖20-100张图片。</span>}
                          </div>
                       </div>
                      </div>
                    </div>
                  </Card>
              }
            </div>
            <div className={styles.oprmenu} >
              <Row gutter={16}>
                <Col span={4}>
                  <Card >
                    <Menu mode="inline" defaultSelectedKeys={['ds']} selectedKeys={[selectKey]} onClick={this.selectKey}>
                      <Menu.Item key="ds"><Icon type="database" />数据集</Menu.Item>
                      {(oprKey=='1'||oprKey=='2'||oprKey=='3') && <Menu.Item key="lb"><Icon type="file-image" />数据标注</Menu.Item> }
                      <Menu.Item key="ml"><Icon type="bars" />我的模型</Menu.Item>
                      <Menu.Item key="run"><Icon type="code" />训练模型</Menu.Item>
                      <Menu.Item key="vy"><Icon type="block" />校验模型</Menu.Item>
                      <Menu.Item key="deploy"><Icon type="cloud-upload" />发布模型</Menu.Item>   
                    </Menu>
                  </Card>
                </Col>
                <Col span={20}>
                  <Card>
                    {children}
                  </Card>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      );
  }
}

export default ComOpr;
