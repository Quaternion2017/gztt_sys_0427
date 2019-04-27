import React, { Component, Fragment } from 'react';
import { Icon } from 'antd';
import './Footer.css';
export default class Footer extends Component {
    render() {
        return (
            <div className="footer">
                <Fragment>
                    Copyright <Icon type="copyright" /> 2019 西安光子同双软件科技有限公司技术部出品
                </Fragment>
            </div>
        )
    }
}
