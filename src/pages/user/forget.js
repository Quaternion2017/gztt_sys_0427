import React, { Component } from 'react';
import { Row, Col, Form, Icon, Input, Button, Checkbox, Tabs, message } from 'antd';
import { Link } from 'react-router-dom';
import "./forget.css";
import { Steps } from 'antd';
import Head from '../../components/user/Head';
import Footer from '../../components/user/Footer';
import 'ant-design-pro/dist/ant-design-pro.css';
import Result from 'ant-design-pro/lib/Result';

const Step = Steps.Step;
export default class forget extends Component {

    constructor(props) {
        super(props);
        this.state = {
            stepSize: 0,
            result: ""
        }
    }

    nextSize = (size) => {
        this.setState({
            stepSize: size
        })
    }

    updateResult = (result, stepSize) => {
        this.setState({
            result: result,
            stepSize: stepSize
        })
    }

    render() {
        const { stepSize, result } = this.state;
        const thic = this;
        return (
            <div id="background" style={{ backgroundImage: 'url("https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg")' }}>
                <Head />
                <Row style={{ marginTop: "8rem" }}>
                    <Col xs={24} lg={{ span: 10, offset: 7 }}>
                        <Steps progressDot size="small" current={stepSize}>
                            <Step title="验证手机号" />
                            <Step title="设置密码" />
                            <Step title="结果页" />
                        </Steps>
                    </Col>
                    <Col xs={{ span: 22, offset: 1 }} lg={{ span: 8, offset: 8 }} style={{ marginTop: "2rem" }}>
                        {(() => {
                            switch (stepSize) {
                                case 0: return <Verify nextSize={thic.nextSize.bind(thic)} stepSize={stepSize} />; break;
                                case 1: return <StepTo stepSize={stepSize} result={thic.updateResult.bind(thic)} />; break;
                                case 2: return <StepResult result={this.state.result} />; break;
                            }
                        }
                        )()}
                    </Col>
                </Row>
                <Footer />
            </div>
        )
    }
}
// 第一步校验手机号
class Verify extends Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            code: "",
            codeButton: "获取验证码",
            codeDisabled: false
        }
    }
    verifySubmit = () => { //校验提交
        const { code } = this.state;
        if (code.length === 4) {
            const stepSize = this.props.stepSize + 1;
            this.props.nextSize(stepSize);
        } else if (code.length < 4 && code.length > 0) {
            message.error('验证码输入有误！');
        } else {
            message.warning('验证码不能为空！');
        }
    }
    updateCode = (e) => { //验证码输入触发事件
        this.setState({
            code: e.target.value
        })
    }
    sendCode = () => { //发送短信验证码
        var sec = 60;
        this.setState({
            codeDisabled: true
        })
        const time = setInterval(() => {
            if (sec < 1) {
                this.setState({
                    codeDisabled: false,
                    codeButton: "获取验证码"
                })
                clearInterval(time);
            } else {
                this.setState({
                    codeButton: sec--
                })
            }
        }, 1000);
    }
    render() {
        const { code, codeButton, codeDisabled } = this.state;
        console.log(code);
        return (
            <div className="lis">
                <div className="li_label">
                    <div className="label">手机号</div>
                    <div className="input">15129430537</div>
                </div>
                <div className="li_label">
                    <div className="label">验证码</div>
                    <div className="input"> <Input name="code" onChange={this.updateCode.bind(this)} value={code} prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="text" placeholder="验证码" maxLength={4} /><Button style={{ marginLeft: "1rem" }} onClick={this.sendCode.bind(this)} disabled={codeDisabled}>{codeButton}</Button></div>
                </div>
                <Button type="primary" block style={{ marginTop: "1rem", height: "45px" }} onClick={this.verifySubmit.bind(this)}>提交</Button>
            </div>
        )
    }
}

// 第二步
class StepTo extends Component {

    submit = () => { //提交设置密码
        const stepSize = this.props.stepSize + 1;
        this.props.result("error", stepSize);
    }

    render() {
        return (
            <div className="lis">
                <div className="li_label">
                    <div className="label">密码</div>
                    <div className="input"> <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="请输入密码" /></div>
                </div>
                <div className="li_label">
                    <div className="label">确认密码</div>
                    <div className="input"> <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="请确认输入密码" /></div>
                </div>
                <Button type="primary" block style={{ marginTop: "1rem", height: "45px" }} onClick={this.submit.bind(this)} >设置密码</Button>
            </div>
        )
    }
}
//第三部
class StepResult extends Component {

    render() {
        return (
            <div className="result">
                {(() => {
                    switch (this.props.result) {
                        case "success":
                            return (
                                <div>
                                    <Result
                                        type="success"
                                        title={<div style={{}}>修改密码成功</div>}
                                    />
                                   <Link to="/"><Button type="primary" block style={{ marginTop: "1rem", height: "45px" }}>立即登录</Button></Link>
                                </div>
                            )
                            break;
                        case "error":
                        return (
                            <div>
                                <Result
                                    type="error"
                                    title="修改失败"
                                    description="有可能是服务器故障或者响应超时导致失败，请您稍后重试"
                                />
                                <Link to="/"><Button type="primary" block style={{ marginTop: "1rem", height: "45px" }}>立即登录</Button></Link>
                                <Button block style={{ marginTop: "1rem", height: "45px" }}>重新提交</Button>
                            </div>
                        )
                        break;
                    }
                })()}
            </div>
        )
    }
}