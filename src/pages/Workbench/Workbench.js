import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Row,Col,Card,Divider } from 'antd';

import styles from './index.less';

class Workbench extends Component {

  state = {
    helpCode:'1',
  }

  // 跳转具体模型操作块
  goDetail = key =>{
    router.push('/main/work/opr/'+key+'/ds');
  }

  // 技术支持模块切换
  chgHelp = code =>{
    this.setState({helpCode:code});
  }

  render() {
    const { helpCode } = this.state;

    return (
      <div>
          <div className={styles.pageMain}>
            <div style={{marginTop:'48px'}}>
              <Row gutter={16}>
                <Col span={18}>
                    <Row  gutter={16}> 
                     <Col span={12}>
                        <Card hoverable>
                          <div className={styles.moduleCard}>
                            <div><span className={styles.themeDesc}>图像分类</span>
                            <span className={styles.modelNum}>模型2个</span></div>
                            <div className={styles.detail}>
                              <div className={styles.detailDesc}> 识别一张图片某类物体/状态/场景</div>
                              <div><a href="#" onClick={()=>this.goDetail('0')}>点击前往</a></div>
                            </div>
                          </div>
                        </Card>
                     </Col>
                     <Col span={12}>
                       <Card hoverable>
                          <div className={styles.moduleCard}>
                            <div><span className={styles.themeDesc}>物体检测</span>
                            <span className={styles.modelNum}>模型1个</span></div>
                            <div className={styles.detail}>
                              <div className={styles.detailDesc}>识别一张图片具有哪些物体，以及其所在位置</div>
                              <div><a href="#" onClick={()=>this.goDetail('1')}>点击前往</a></div>
                            </div>
                          </div>
                        </Card>
                     </Col>
                   </Row>
                   <div style={{height:'16px'}}></div>
                   <Row gutter={16}>
                     <Col span={12}>
                        <Card hoverable>
                          <div className={styles.moduleCard}>
                            <div><span className={styles.themeDesc}>图像分隔</span>
                            <span className={styles.modelNum}>模型1个</span></div>
                            <div className={styles.detail}>
                              <div className={styles.detailDesc}>识别图中每个目标的名称、位置及轮廓，按目标名称计数</div>
                              <div><a href="#" onClick={()=>this.goDetail('2')}>点击前往</a></div>
                            </div>
                          </div>
                        </Card>
                     </Col>
                      <Col span={12}>
                        <Card hoverable>
                          <div className={styles.moduleCard}>
                            <div><span className={styles.themeDesc}>关键点检测</span>
                            <span className={styles.modelNum}></span></div>
                            <div className={styles.detail}>
                              <div className={styles.detailDesc}>检测图片中关键部分</div>
                              <div><a href="#" onClick={()=>this.goDetail('3')}>点击前往</a></div>
                            </div>
                          </div>
                        </Card>
                     </Col>
                   </Row>
                </Col>
                <Col span={6}>
                  <Card>
                      <div className={styles.helpCard}>
                        <div style={{fontSize:'20px'}}>技术支持</div>
                        <div style={{marginTop:'10px'}} >
                          <span className={styles.helpTest} onClick={()=>this.chgHelp('1')}>文档</span>
                          <Divider type="vertical" />
                          <span className={styles.helpTest} onClick={()=>this.chgHelp('2')}>教学视频</span>
                          <Divider type="vertical" />
                          <span className={styles.helpTest} onClick={()=>this.chgHelp('3')}>论坛</span>
                        </div>
                        {
                          helpCode=='1' &&
                           <div>
                            <div className={styles.helpTest} style={{marginTop:'10px'}}>图像识别模型如何训练及使用？</div>
                            <div className={styles.helpTest} >物体检测模型如何训练及使用？</div>
                            <div className={styles.helpTest} >图像分割模型如何训练及使用？</div>
                            <div className={styles.helpTest} >声音分类模型如何训练及使用？</div>
                            <div className={styles.helpTest} >视频分类模型如何训练及使用？</div>
                            <div className={styles.helpTest} >如何在AI市场售卖定制模型API？</div>
                            <div className={styles.helpTest} >常见问题</div>
                          </div>
                        }
                        {
                          helpCode=='2' &&
                           <div>
                            <div className={styles.helpTest} style={{marginTop:'10px'}}>3分钟了解EasyDL</div>
                            <div className={styles.helpTest} >图像分类教学视频</div>
                            <div className={styles.helpTest} >物体检测教学视频</div>
                            <div className={styles.helpTest} >声音分类教学视频</div>
                          </div>
                        }
                       
                      </div>
                  </Card>
                </Col>
              </Row>
            </div>
          </div>
          
        </div>
      );

  }
}

export default Workbench;
