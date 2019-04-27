import React, { Component } from 'react'
import { Row, Col } from 'antd';
import './Head.css';
import LOGO from '../../common/images/LOGO.png'

export default class Head extends Component {
    render() {
        return (
            <Row>
                {/* LOGO、名称 */}
                <Col id="login_head" span={14} offset={5}>
                    <div className="head_logo" style={{ backgroundImage: 'url("' + LOGO + '")', height: "60px", width: '60px' }}></div>
                    <div className="head_context">
                        <div className="title">光子资讯企业管理平台</div>
                    </div>
                    <div className="title2">光子资讯 让天下没有难做的生意,为您企业营销助力</div>
                </Col>
            </Row>
        )
    }
}
