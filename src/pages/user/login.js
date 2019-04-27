import React, { Fragment } from 'react';
import { Row, Col, Form, Icon, Input, Button, Checkbox, Tabs } from 'antd';
import propTypes from 'prop-types';
import './login.css';
import Head from '../../components/user/Head';
import Footer from '../../components/user/Footer';
import { Link } from 'react-router-dom';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
export default class Login extends React.Component {



    componentDidMount() {
    }
    callback = (key) => {
        console.log(key);
    }
    render() {
        return (

            //栅格布局
            <div id="background" style={{ backgroundImage: 'url("https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg")' }}>
                {/* LOGO、名称 */}
                <Head />
                <Row>
                    {/* <Col id="login_head" span={14} offset={5}>
                        <div className="head_logo" style={{ backgroundImage: 'url("' + LOGO + '")', height: "60px", width: '60px' }}></div>
                        <div className="head_context">
                            <div className="title">光子资讯企业管理平台</div>
                        </div>
                        <div className="title2">光子资讯 让天下没有难做的生意,为您企业营销助力</div>
                    </Col> */}
                    <Col id="login_from_col" span={14} offset={5}>
                        <Tabs defaultActiveKey="1" onChange={this.callback}>
                            <TabPane tab="账号密码登录" key="1">
                                <WrappedNormalLoginForm />
                            </TabPane>
                            <TabPane tab="手机号登录" key="2">
                                <WrappedPhoneLoginForm />
                            </TabPane>
                        </Tabs>
                    </Col>
                </Row>
                <Footer />
            </div>
        )
    }

}
// 登陆表单组件
class NormalLoginForm extends React.Component {

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
        };
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem  {...formItemLayout}>
                    {getFieldDecorator('userName', {
                        rules: [{ required: true, message: 'Please input your username!' }],
                    })(
                        <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
                    )}
                </FormItem>
                <FormItem  {...formItemLayout}>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: 'Please input your Password!' }],
                    })(
                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
                    )}
                </FormItem>
                <FormItem  {...formItemLayout}>
                    {getFieldDecorator('remember', {
                        valuePropName: 'checked',
                        initialValue: true,
                    })(
                        <Checkbox>自动登录</Checkbox>
                    )}
                    <Link to="/forget" className="login-form-forgot">忘记密码</Link>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        登录
                    </Button>
                </FormItem>
            </Form>
        );
    }
}
const WrappedNormalLoginForm = Form.create()(NormalLoginForm);
// 登陆表单组件
class PhoneLoginForm extends React.Component {

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
        };
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem  {...formItemLayout}>
                    {getFieldDecorator('phone', {
                        rules: [{ required: true, message: 'Please input your username!' }],
                    })(
                        <Input prefix={<Icon type="mobile" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="手机号" maxLength={11} />
                    )}
                </FormItem>
                <FormItem  {...formItemLayout}>
                    {getFieldDecorator('code', {
                        rules: [{ required: true, message: 'Please input your Password!' }],
                    })(
                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="text" placeholder="验证码" maxLength={4} />
                    )}
                    <Button>获取验证码</Button>
                </FormItem>
                <FormItem  {...formItemLayout}>
                    {getFieldDecorator('remember', {
                        valuePropName: 'checked',
                        initialValue: true,
                    })(
                        <Checkbox>自动登录</Checkbox>
                    )}
                    <Link to="/forget" className="login-form-forgot">忘记密码</Link>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        登录
                    </Button>
                </FormItem>
            </Form>
        );
    }
}
const WrappedPhoneLoginForm = Form.create()(PhoneLoginForm);