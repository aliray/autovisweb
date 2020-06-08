import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import { Checkbox, Alert,Tabs, Icon,Form,Card,Input,Button} from 'antd';
import styles from './Login.less';
import router from 'umi/router';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;

@connect((state) => ({
  success:state.login.success,
  submitting: state.loading.effects['login/login'], 
}))
class LoginPage extends Component {
  state = {
    currentUser:{},
    cookieNone:'0',
    msgShow:true,
  }

  // 登录
  handleSubmit = () => {
    console.log(navigator.cookieEnabled);
    const flag = navigator.cookieEnabled;
    const { form } = this.props; 
    form.validateFields((err,fieldsValue) => {
      if(err) return;
      const { dispatch } = this.props;
      dispatch({
        type: 'login/login',
        payload: {
          user_name:fieldsValue.user_name,
          password:fieldsValue.password,
        },
      }).then(() => {
        const { success } = this.props;
        this.setState({msgShow:success})
        if(success){
          router.push('/main/work');
        }
      });
    });
    
  };
  // 错误消息提示
  renderMessage = () => (
    <Alert style={{ marginBottom: 24 }} message='用户名或者密码不正确' type="error" showIcon />
  );
  // cookie未开启提示
  cookieNoneMessage = () =>{
    <Alert style={{ marginBottom: 24 }} message='请开启cookie' type="error" showIcon />
  }

  chgTabPane = k =>{

  }

  render() {
    const { submitting,success,form: { getFieldDecorator }} = this.props;
    const { cookieNone,msgShow } = this.state;

    const formItemLayout = {
           labelCol: {
          span: 24,
         },
         wrapperCol: {
          span: 24,
         },
      };
  
    return (
      <div className={styles.main} style={{marginTop:'100px'}}>
        <Card>
         <div className={styles.tabs}>
            <Tabs defaultActiveKey="1" onChange={this.chgTabPane} >
              <TabPane tab='账号登录' key="1">
                 {!msgShow && this.renderMessage()}
                <Form {...formItemLayout}>
                  <FormItem label='用户名'>
                      {getFieldDecorator('user_name',{
                            rules: [
                                    {
                                      required: true,
                                      message: '请输入用户名或者邮箱',
                                    },
                                  ],
                          })(
                             <Input  placeholder="输入用户名或者邮箱"/>
                          )}
                  </FormItem>
                  <FormItem label='密码'>
                      {getFieldDecorator('password',{
                            rules: [
                                    {
                                      required: true,
                                      message: '请输入密码',
                                    },
                                  ],
                          })(
                             <Input.Password placeholder="输入密码"/>
                          )}
                  </FormItem>
                  <FormItem >  
                      <Button type="primary" onClick={this.handleSubmit}  style={{width:'100%'}}>登录</Button>
                  </FormItem>
                  <FormItem >  
                      <div style={{marginTop:'-20px'}}><a><span style={{color:'#969DA6'}}>忘记密码 ?</span></a></div>
                  </FormItem>

                </Form>
              </TabPane>
              <TabPane tab='短信登陆' key="2">
                <Form {...formItemLayout}>
                  <FormItem label='手机号'>
                      {getFieldDecorator('phone',{
                            rules: [
                                    {
                                      message: '请输入手机号',
                                    },
                                  ],
                          })(
                             <Input  placeholder="请输入手机号"/>
                          )}
                  </FormItem>
                  <FormItem label='验证码'>
                    <div>
                      <Input placeholder="验证码" style={{width:'63%'}}/>
                      <Button style={{width:'35%',marginLeft:'5px'}}>发送验证码</Button>
                    </div>
                  </FormItem>
                  <FormItem >  
                      <Button type="primary" style={{width:'100%'}}>登录</Button>
                  </FormItem>
                  <FormItem >  
                      <div style={{marginTop:'-20px'}}><a><span style={{color:'#969DA6'}}>忘记密码 ?</span></a></div>
                  </FormItem>

                </Form>
              </TabPane>
            </Tabs>
          </div>
        </Card>
      </div>
    );
  }
}

export default Form.create()(LoginPage);
