import React, { Component } from 'react'
import { Row, Col, Menu, Icon, Button, Layout, Tag, Avatar, Popover, List } from 'antd';
import LOGO from '../../common/images/LOGO.png'
import "./index.css";
import NoticeIcon from 'ant-design-pro/lib/NoticeIcon';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import { Link,Route } from 'react-router-dom';
import Rbac from '../rbac/rbac';

const { Header, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;
function onItemClick(item, tabProps) {
    console.log(item, tabProps);
}

function onClear(tabTitle) {
    console.log(tabTitle);
}


function getNoticeData(notices) {
    if (notices.length === 0) {
        return {};
    }
    const newNotices = notices.map((notice) => {
        const newNotice = { ...notice };
        if (newNotice.datetime) {
            newNotice.datetime = moment(notice.datetime).fromNow();
        }
        // transform id to item key
        if (newNotice.id) {
            newNotice.key = newNotice.id;
        }
        if (newNotice.extra && newNotice.status) {
            const color = ({
                todo: '',
                processing: 'blue',
                urgent: 'red',
                doing: 'gold',
            })[newNotice.status];
            newNotice.extra = <Tag color={color} style={{ marginRight: 0 }}>{newNotice.extra}</Tag>;
        }
        return newNotice;
    });
    return groupBy(newNotices, 'type');
}
export default class index extends Component {

    state = {
        collapsed: false,
    }

    componentDidMount(){
        document.title="光子头条-企业管理平台"
    }

    toggleCollapsed = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }
    render() {
        const { collapsed } = this.state;
        const data = [{
            id: '000000001',
            avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
            title: '你收到了 14 份新周报',
            datetime: '2017-08-09',
            type: '通知',
        }, {
            id: '000000002',
            avatar: 'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png',
            title: '你推荐的 曲妮妮 已通过第三轮面试',
            datetime: '2017-08-08',
            type: '通知',
        }, {
            id: '000000003',
            avatar: 'https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png',
            title: '这种模板可以区分多种通知类型',
            datetime: '2017-08-07',
            read: true,
            type: '通知',
        }, {
            id: '000000004',
            avatar: 'https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png',
            title: '左侧图标用于区分不同的类型',
            datetime: '2017-08-07',
            type: '通知',
        }, {
            id: '000000005',
            avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
            title: '内容不要超过两行字，超出时自动截断',
            datetime: '2017-08-07',
            type: '通知',
        }, {
            id: '000000006',
            avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
            title: '曲丽丽 评论了你',
            description: '描述信息描述信息描述信息',
            datetime: '2017-08-07',
            type: '消息',
            clickClose: true,
        }, {
            id: '000000007',
            avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
            title: '朱偏右 回复了你',
            description: '这种模板用于提醒谁与你发生了互动，左侧放『谁』的头像',
            datetime: '2017-08-07',
            type: '消息',
            clickClose: true,
        }, {
            id: '000000008',
            avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
            title: '标题',
            description: '这种模板用于提醒谁与你发生了互动，左侧放『谁』的头像',
            datetime: '2017-08-07',
            type: '消息',
            clickClose: true,
        }, {
            id: '000000009',
            title: '任务名称',
            description: '任务需要在 2017-01-12 20:00 前启动',
            extra: '未开始',
            status: 'todo',
            type: '待办',
        }, {
            id: '000000010',
            title: '第三方紧急代码变更',
            description: '冠霖提交于 2017-01-06，需在 2017-01-07 前完成代码变更任务',
            extra: '马上到期',
            status: 'urgent',
            type: '待办',
        }, {
            id: '000000011',
            title: '信息安全考试',
            description: '指派竹尔于 2017-01-09 前完成更新并发布',
            extra: '已耗时 8 天',
            status: 'doing',
            type: '待办',
        }, {
            id: '000000012',
            title: 'ABCD 版本发布',
            description: '冠霖提交于 2017-01-06，需在 2017-01-07 前完成代码变更任务',
            extra: '进行中',
            status: 'processing',
            type: '待办',
        }];
        const noticeData = getNoticeData(data);
        const data2 = [
            {
                icon: "setting",
                title: '账号设置',
            },
            {
                icon: "poweroff",
                title: '注销登录',
                url: '/'
            },
            {
                icon: "clock-circle",
                title: '最近登录时间:2018-01-22 12:25:34',
            },
            {
                icon: "bulb",
                title: '到期时间:2018-01-22 12:25:34',
            },
        ];
        const content = (

            <List
                itemLayout="horizontal"
                dataSource={data2}
                split={false}
                renderItem={item => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar size={22} icon={item.icon} style={{ backgroundColor: '#fff', color: '#bfbfbf', verticalAlign: 'top' }} />}
                            title={<Link to={item.url}>{item.title}</Link>}
                        />
                    </List.Item>
                )}
            />
        );

        return (
            <Layout style={{ height: '100%' }}>
                <Sider
                    trigger={null}
                    collapsible
                    collapsed={this.state.collapsed}
                >
                    <div className="logo" style={{ height: '64px' }} >
                        <img src={LOGO} height="45px"></img>

                        <h1 style={{ fontSize: "20px", color: "#FFF", display: collapsed ? 'none' : 'block' }}>企业管理平台</h1>
                    </div>
                    <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                        <Menu.Item key="1">
                            <Icon type="usergroup-add" />
                            <span>权限设置</span>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Icon type="video-camera" />
                            <span>nav 2</span>
                        </Menu.Item>
                        <Menu.Item key="3">
                            <Icon type="upload" />
                            <span>nav 3</span>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout>
                    <Header style={{ background: '#fff', padding: 0 }}>
                        <Icon
                            className="trigger"
                            type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                            onClick={this.toggle}
                        />
                        {/* 用户信息 */}
                        <div className="userInfo" style={{
                            float: 'right',
                            height: '64px',
                            lineHeight: '64px',
                            padding: '0 32px',
                            display: "flex",
                            alignItems: "center",
                            boxShadow: '0 1px 4px rgba(0,21,41,.12)',
                        }}>
                            <Popover placement="topLeft" content={content} arrowPointAtCenter>
                                <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                                <span>张三</span>
                            </Popover>
                        </div>
                        <div
                            style={{
                                textAlign: 'right',
                                height: '64px',
                                lineHeight: '64px',
                                boxShadow: '0 1px 4px rgba(0,21,41,.12)',
                                padding: '0 32px',
                                float: 'right'
                            }}
                        >

                            <NoticeIcon
                                className="notice-icon"
                                count={5}
                                onItemClick={onItemClick}
                                onClear={onClear}
                            >
                                <NoticeIcon.Tab
                                    list={noticeData['通知']}
                                    title="通知"
                                    emptyText="你已查看所有通知"
                                    emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
                                />

                            </NoticeIcon>
                        </div>

                    </Header>
                    <Content style={{
                        margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280,
                    }}
                    >
                       <Rbac></Rbac>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}
