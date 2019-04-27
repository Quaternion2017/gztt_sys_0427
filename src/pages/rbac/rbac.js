import React, { Component } from 'react';
import { Tabs, Select, Table, Row, Col, Button, Input, Modal, Form, Badge, List, Icon, Cascader, message, Switch, InputNumber, Collapse, Tree, Popconfirm } from 'antd';
import './rbac.less';
import province from '../../mock/geographic/province.json';
import city from '../../mock/geographic/city.json';
import district from '../../mock/geographic/district.json';
import apiRequest from '../../servers/api/apiRequest';
const Search = Input.Search;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const { TreeNode } = Tree;

const confirm = Modal.confirm;
const Panel = Collapse.Panel;
const EditableContext = React.createContext();
const FormItem = Form.Item;
const data = [];

export default class rbac extends Component {
  state = {
    tabPosition: 'left',
    accountData: [],
    pagination: {
      total: 0,
      pageSize: 5
    },
    current: 0,
    visible: false,
    tabData: [],
    roles: [],
    menus: [],
    loading: true,
    name: "",
    playModel: false,
    activationNumber: 1, //激活码数量
    expandedKeys: ['0-0-0', '0-0-1'],
    autoExpandParent: true,
    checkedKeys: ['0-0-0'],
    selectedKeys: [],
    functionModel: false,
    menuId: 0
  }

  constructor(props) {
    super(props);
  }

  showConfirm = () => {

    confirm({
      title: '是否确认续费?',
      content: '续费将消耗您5个激活码，是否继续操作！',
      cancelText: "取消",
      okText: "确认",
      onOk() {
        return new Promise((resolve, reject) => {
          setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
        }).catch(() => console.log('Oops errors!'));
      },
      onCancel() {
        console.log(123);
        // this.setState({
        //   activationNumber:1
        // })
      },
    });
  }
  componentDidMount() {
    var { current } = this.state;
    this.queryPage(current, this.state.pagination.pageSize);


  }
  functionModel = (id) => { //显示功能设置窗口
    console.log(id);
    this.setState({
      functionModel: true,
      menuId: id
    })
  }
  updateState = (id, state) => {  //更改账号状态
    let { pagination } = this.state;
    let promise = apiRequest.all("updateState", id + "/" + state, null, "服务器繁忙请稍后重试！");
    var thic = this;
    promise.then(function (value) {
      if (value.code === 1) {
        thic.queryPage((pagination.current - 1) * pagination.pageSize, pagination.pageSize);
      }
    })
  }
  queryPage = (current, size, name) => { //分页查询数据
    let promise = apiRequest.all("adminQueryPage", current + "/" + size + (name !== undefined ? "?name=" + name : ""), null, "服务器繁忙请稍后重试！");
    var thic = this;
    promise.then(function (value) {
      if (value.code === 1) {
        let pagination = thic.state.pagination;
        pagination.total = value.data.count;
        pagination.onChange = thic.paging.bind(thic, "1")
        console.log(pagination);
        thic.setState({
          tabData: value.data.data,
          pagination: thic.state.pagination,
          loading: false,
          name: name
        });
      }
    })
  }

  selectRoleAll = () => {
    let promise = apiRequest.all("queryAllRole", null, null, "服务器繁忙请稍后重试！");
    var thic = this;
    promise.then(function (value) {
      if (value.code === 1) {
        thic.setState({
          roleDatas: value.data,
          loading: false
        })
      }
    })
  }

  showModal2 = (roleObj) => { //角色添加框
    this.setState({
      visible2: true,
      roleObj: roleObj
    });
  }


  paging = (switchName, page, pageSize) => {
    console.log(page + " " + pageSize + " " + switchName);
    switch (switchName) {
      case "1":
        this.queryPage((page - 1) * this.state.pagination.pageSize, pageSize);
        break;
      case "2":
        this.queryMenuAll(null, (page - 1) * this.state.pagination.pageSize, pageSize);
        break;
    }

  }

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }

  handleCancel2 = (e) => {
    this.setState({
      visible2: false,
    });
  }
  handleCancel3 = (e) => {
    this.setState({
      visible3: false,
    });
  }
  handleSelectChange = (value) => {
    this.props.form.setFieldsValue({
      note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`,
    });
  }
  showModal = () => {
    this.setState({
      visible: true
    });
  }
  showModal3 = (text) => {
    var { total } = this.state.pagination;
    let promise = apiRequest.all("queryMenuPage", 0 + "/" + total, null, "服务器繁忙请稍后重试！");
    var thic = this;
    promise.then(function (value) {
      if (value.code === 1) {
        console.log(value.data);
        thic.setState({
          menuOption: value.data.data,
          visible3: true,
          menu: text == undefined ? {} : text
        })
      }
    })
  }
  removeRole = (id, index) => { //删除角色
    let promise = apiRequest.all("removeRole", id, "删除成功", "服务器繁忙请稍后重试！");
    var thic = this;
    promise.then(function (value) {
      if (value.code === 1) {
        const { roleDatas } = thic.state;
        roleDatas.splice(index, 1);
        thic.setState({
          roleDatas: roleDatas
        })
      }
    })
  }

  updateSh = (e, index, checked) => { //更新菜单是否显示
    var data = {
      id: e.id,
      sh: checked ? 0 : 1
    }
    let promise = apiRequest.all("updateMenu", data, "更新成功", "服务器繁忙请稍后重试！");
    var thic = this;
    promise.then(function (value) {
      if (value.code === 1) {
        const { menus } = thic.state;
        const obj = menus[index];
        if (obj.id != e.id) {
          const children = thic.selectMenu(obj.children, e.id, checked);
          obj.children = children;
        } else {
          obj.sH = checked ? 0 : 1
        }
        thic.setState({
          menus: menus
        })
      }
    })
  }

  selectMenu = (children, id, checked) => {
    for (let i = 0; i < children.length; i++) {
      var obj = children[i];
      if (obj.id == id) {
        obj.sH = checked ? 0 : 1
        break;
      } else if (obj.children.length > 0) {
        this.selectMenu(obj.children, id, checked);
      }
    }
    console.log(children);
    return children;
  }

  queryMenuAll = (name, current, size) => {
    let promise = apiRequest.all("queryMenuPage", current + "/" + size + "?name=" + name, null, "服务器繁忙请稍后重试！");
    var thic = this;
    promise.then(function (value) {
      if (value.code === 1) {
        const { pagination } = thic.state;
        pagination.total = value.data.count;
        pagination.onChange = thic.paging.bind(thic, "2")
        thic.setState({
          menus: value.data.data,
          pagination: pagination,
          loading: false,
          name: name
        })
        console.log(pagination);
      }
    })
  }

  loadingTab = (e) => {
    switch (parseInt(e)) {
      case 1:
        this.queryPage(0, this.state.pagination.pageSize);
        break;
      case 2:
        this.queryMenuAll(null, 0, this.state.pagination.pageSize);
        break;
      case 3:
        this.selectRoleAll();
        break;
      default:
        break;
    }
  }

  removeMenu = (id) => { //删除菜单
    let promise = apiRequest.all("removeMenu", id, "删除成功", null);
    var thic = this;
    promise.then(function (value) {
      if (value.code === 1) {
        thic.queryMenuAll(thic.state.name, thic.state.current, thic.state.pagination.pageSize);
      }
    })
  }

  showPlayModel = () => { //显示购买和充值模态框
    this.setState({ playModel: true });
  }
  playModelCancel = () => { //取消充值窗口
    this.setState({ playModel: false, activationNumber: 1 }, () => {

      console.log(this.state.activationNumber);
    })
  }

  onExpand = (expandedKeys) => {
    console.log('onExpand', expandedKeys);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }

  onCheck = (checkedKeys) => {
    console.log('onCheck', checkedKeys);
    this.setState({ checkedKeys });
  }

  onSelect = (selectedKeys, info) => {
    console.log('onSelect', info);
    this.setState({ selectedKeys });
  }

  renderTreeNodes = data => data.map((item) => {
    if (item.children) {
      return (
        <TreeNode title={item.title} key={item.key} dataRef={item}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode {...item} />;
  })

  render() {
    const { tabData, pagination, roleDatas, roleObj, visible3, menus, menuOption, menu, name, activationNumber, menuId } = this.state;
    const columns = [
      {
        title: '编号',
        dataIndex: 'id',
        key: 'id',
        render: (text, record, index) => {
          return index + 1;
        }
      }, {
        title: '账号',
        dataIndex: 'account',
        key: 'account',
      }, {
        title: '角色',
        dataIndex: 'role',
        key: 'role',
      }, {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render: (text, record, index) => {
          return new Date(text).toLocaleString();
        }
      }, {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        render: (text, record, index) => {
          switch (text) {
            case 0:
              return (
                <span style={{ color: '#52c41a' }}><Badge status="success" />正常</span>
              )
            case 1:
              return (
                <span style={{ color: 'red' }}><Badge status="error" />冻结</span>
              )
            default:
              return "未知"
          }
        }
      }, {
        title: '最近登录时间',
        dataIndex: 'lastTime',
        key: 'lastTime',
        render: (text, record, index) => {
          if (text != null && text.length > 0) {
            return new Date(text).toLocaleString();
          }
        }
      }, {
        title: '到期时间',
        dataIndex: 'expire_time',
        key: 'expire_time',
        render: (text, record, index) => {
          if (text != null) {
            return new Date(text).toLocaleString();
          }
        }
      }, {
        title: '激活码数量',
        dataIndex: 'activation_number',
        key: 'activation_number',
        render: (text, record, index) => {
          if (text < 0) {
            return "无限制";
          }
          return text;
        }
      }, {
        title: '操作',
        dataIndex: 'id',
        key: 'caozuo',
        render: (text, record, index) => {
          return (
            <div>
              <Button onClick={this.updateState.bind(this, record.id, record.state === 1 ? 0 : 1)} style={{ marginBottom: '0.2rem' }}>{record.state === 1 ? "解冻" : "冻结"}</Button>
              &nbsp;
              <Button type="primary" onClick={this.showPlayModel.bind(this)} style={{ display: record.activation_number < 0 ? 'none' : 'inline-block', marginBottom: '0.2rem' }}>充值</Button>
              &nbsp;
              <Button type="primary" onClick={this.showConfirm.bind(this)} style={{ display: record.expire_time === null ? 'none' : 'inline-block', marginBottom: '0.2rem' }}>续费</Button>
            </div>
          )
        }
      }];

    const columns2 = [{
      title: '菜单名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '访问路径',
      dataIndex: 'url',
      key: 'url',
      width: '12%',
    }, {
      title: '模块',
      dataIndex: 'module',
      width: '30%',
      key: 'module',
    }, {
      title: '是否显示',
      key: 'sH',
      render: (text, record, index) => {
        return (<Switch checkedChildren="显示" unCheckedChildren="隐藏" checked={text.sH == 0} defaultChecked onClick={this.updateSh.bind(this, text, index)} />);
      }
    }, {
      title: '操作',
      width: '30%',
      key: 'id',
      render: (text, record, index) => {
        console.log(record);
        console.log(index);
        return (
          <div>
            <Button icon="edit" onClick={this.showModal3.bind(this, text)}>修改</Button>
            &nbsp;
            <Button icon="delete" type="danger" onClick={this.removeMenu.bind(this, text.id)}>删除</Button>
            &nbsp;
            <Button icon="appstore" onClick={this.functionModel.bind(this, record.id)} style={{ display: record.children === undefined ? 'inline-block' : 'none' }} >更新功能</Button>
          </div>
        )
      }
    }];

    const treeData = [{
      title: '0-0',
      key: '0-0',
      children: [{
        title: '0-0-0',
        key: '0-0-0',
        children: [
          { title: '0-0-0-0', key: '0-0-0-0' },
          { title: '0-0-0-1', key: '0-0-0-1' },
          { title: '0-0-0-2', key: '0-0-0-2' },
        ],
      }, {
        title: '0-0-1',
        key: '0-0-1',
        children: [
          { title: '0-0-1-0', key: '0-0-1-0' },
          { title: '0-0-1-1', key: '0-0-1-1' },
          { title: '0-0-1-2', key: '0-0-1-2' },
        ],
      }, {
        title: '0-0-2',
        key: '0-0-2',
      }],
    }, {
      title: '0-1',
      key: '0-1',
      children: [
        { title: '0-1-0-0', key: '0-1-0-0' },
        { title: '0-1-0-1', key: '0-1-0-1' },
        { title: '0-1-0-2', key: '0-1-0-2' },
      ],
    }, {
      title: '0-2',
      key: '0-2',
    }];

    return (
      <div style={{ background: '#fff', height: '100%' }}>
        {/* 添加、更新用户 */}
        <Modal
          visible={this.state.visible}
          closable={false}
          destroyOnClose={true}
          footer={null}
        >
          <AddUserFrom handleCancel={this.handleCancel.bind(this)} queryPage={this.queryPage.bind(this)} size={pagination.pageSize} name2={name}></AddUserFrom>
        </Modal>
        {/* 购买和充值 */}
        <Modal
          title="充值"
          visible={this.state.playModel}
          onOk={this.handleOk}
          okText="保存"
          cancelText="取消"
          onCancel={this.playModelCancel.bind(this)}
        >
          <div>
            <Row style={{ display: 'flex' }}>
              <Col span={6} style={{ display: 'flex', alignItems: 'center', fontSize: '1rem' }}>激活码数量</Col>
              <Col span={18}> <InputNumber min={1} defaultValue={activationNumber} value={activationNumber} onChange={number => this.setState({ activationNumber: number })} /></Col>
            </Row>
          </div>
        </Modal>
        {/* 菜单：更多功能 */}
        <Modal
          title="功能设置"
          visible={this.state.functionModel}
          onOk={this.handleOk}
          footer={[
            <Button key="back" onClick={() => {
              this.setState({
                functionModel: false
              })
            }}>关闭</Button>
          ]}
          cancelText="取消"
          onCancel={this.functionModel.bind(this)}
          width="50%"
          destroyOnClose
          closable={false}
        >
          <EditableFormTable menuId={menuId} ></EditableFormTable>
        </Modal>
        <Tabs tabPosition={this.state.tabPosition} tabBarGutter={10} animated style={{ height: '75vh', width: '100%' }} onChange={this.loadingTab.bind(this)}>
          <TabPane tab="账号管理" key="1">
            <div className="tabPane">
              <Row gutter={32} style={{ padding: '1rem  0 1rem 0' }}>
                <Col span={12} style={{ paddingLeft: '0' }}>  <Search
                  placeholder="账号、编号查询"
                  onSearch={(value) => {
                    this.queryPage(0, pagination.pageSize, value)
                  }}
                  style={{ width: 200 }}
                /></Col>
                <Col span={11} style={{ textAlign: 'right', paddingRight: '0' }}><Button type="primary" onClick={this.showModal}>添加</Button></Col>
              </Row>
              <Row gutter={32}>
                <Table
                  dataSource={tabData}
                  columns={columns}
                  pagination={pagination}
                  loading={this.state.loading}
                  onChange={
                    (pagination, filters, sorter, extra) => {
                      console.log(pagination);
                      this.setState({
                        pagination: pagination
                      })
                    }
                  }
                  style={{ marginRight: '24px' }}
                />
              </Row>
            </div>
          </TabPane>
          <TabPane tab="菜单管理" key="2">
            {/* 添加、更新菜单 */}
            <Modal
              visible={visible3}
              closable={false}
              destroyOnClose={true}
              footer={null}
            >
              <AddMenuFrom menus={menuOption} menu={menu} handleCancel={this.handleCancel3.bind(this)} queryPage={this.queryMenuAll.bind(this)} current={this.state.current} size={pagination.pageSize} name2={name}></AddMenuFrom>
            </Modal>
            <Row gutter={32} style={{ padding: '1rem  0 1rem 0' }}>
              <Col span={12} style={{ paddingLeft: '0' }}>  <Search
                placeholder="名称、模块查询"
                onSearch={(value) => {
                  this.queryMenuAll(value, 0, this.state.pagination.pageSize)
                }}
                style={{ width: 200 }}
              /></Col>
              <Col span={11} style={{ textAlign: 'right', paddingRight: '0' }}><Button type="primary" onClick={this.showModal3}>添加菜单</Button></Col>
            </Row>
            <Row gutter={32} style={{ marginRight: '0' }}>
              <Table pagination={this.state.pagination} columns={columns2} dataSource={menus} />
            </Row>
          </TabPane>
          <TabPane tab="功能权限" key="3">
            <Row>
              <Col span={5} style={{ height: '75vh', overflowY: 'auto', overflowX: 'hidden' }}>
                {/* 添加、更新角色 */}
                <Modal
                  visible={this.state.visible2}
                  onOk={this.addUser}
                  onCancel={this.handleCancel2}
                  closable={false}
                  destroyOnClose={true}
                  footer={null}
                >
                  <AddRoleFrom handleCancel={this.handleCancel2.bind(this)} selectRoleAll={this.selectRoleAll} roleObj={roleObj}></AddRoleFrom>
                </Modal>
                <List
                  itemLayout="horizontal"
                  dataSource={roleDatas}
                  bordered={true}
                  renderItem={(item, index) => (
                    <List.Item>
                      <List.Item.Meta style={{ width: '60px', overflow: 'hidden' }}
                        title={<a href="https://ant.design" style={{ overflow: 'hidden' }}>{item.name}</a>}
                        description={item.desc}
                      />
                      {/* 操作 */}
                      <div className="operation">
                        <Icon type="edit" style={{ marginRight: '1rem', marginLeft: '0.5rem' }} onClick={this.showModal2.bind(this, item)} />
                        <Icon type="delete" onClick={this.removeRole.bind(this, item.id, index)} />
                      </div>
                    </List.Item>

                  )}>
                  <Button type="dashed" block style={{ position: 'absolute', bottom: '0', height: '3rem', bottom: '-2' }} onClick={this.showModal2.bind(this)}><Icon type="plus" />添加角色</Button>
                </List>
              </Col>
              <Col span={18} offset={1} style={{ border: '1px solid #d9d9d9', height: '75vh' }}>
                <Tree
                  checkable
                  onExpand={this.onExpand}
                  expandedKeys={this.state.expandedKeys}
                  autoExpandParent={this.state.autoExpandParent}
                  onCheck={this.onCheck}
                  checkedKeys={this.state.checkedKeys}
                  onSelect={this.onSelect}
                  selectedKeys={this.state.selectedKeys}
                >
                  {this.renderTreeNodes(treeData)}
                </Tree>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </div >
    )
  }
}
class AddRole extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
    }
  }

  addRole = (e) => { //添加 || 更新 角色
    this.setState({
      loading: true
    });
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let id = this.props.roleObj.id;
        if (id !== undefined) {
          values.id = id;
          values.activationNumber = this.state.activationNumber;
          values.isExpirationTime = this.state.isExpirationTime ? 1 : 0;
          values.grade = this.state.grade;
        }
        let promise = apiRequest.all("addRole", values, "更新成功", "服务器繁忙请稍后重试！");
        var thic = this;
        promise.then(function (value) {
          if (value.code === 1) {
            thic.setState({
              loading: false
            });
            thic.props.handleCancel();
            thic.props.selectRoleAll();
          }

        })
      }
    })
  }



  render() {
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 10 },
    };
    let { loading, activationNumber, isExpirationTime, grade } = this.state;
    const { getFieldDecorator } = this.props.form;
    const roleObj = this.props.roleObj;
    if (roleObj.isExpirationTime !== undefined && isExpirationTime === undefined) {
      this.setState({
        isExpirationTime: roleObj.isExpirationTime === 1
      })
    }
    if (roleObj.activationNumber !== undefined && activationNumber === undefined) {
      this.setState({
        activationNumber: roleObj.activationNumber
      })
    }
    if (roleObj.grade !== undefined && grade === undefined) {
      this.setState({
        grade: roleObj.grade
      })
    }
    return (
      <Form >
        <Form.Item
          label="角色名称"
          required
          {...formItemLayout}
          style={{ marginBottom: '0' }}
        >
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请填写角色名称' }],
            initialValue: (roleObj.name === undefined ? '' : roleObj.name)
          })(
            <Input name="name" placeholder="请输入角色名称" type="text" />
          )}
        </Form.Item>
        <Form.Item
          label="到期日期"
          required
          {...formItemLayout}
          style={{ marginBottom: '0' }}
        >
          <Switch defaultChecked checked={isExpirationTime} onChange={e => this.setState({ isExpirationTime: e })} />,
        </Form.Item>
        <Form.Item
          label="激活码数"
          required
          {...formItemLayout}
          style={{ marginBottom: '0' }}
        >
          <InputNumber
            formatter={value => `${value}个`}
            parser={value => value.replace('个', '')}
            min={-1} max={1000} defaultValue={roleObj.activationNumber !== undefined ? roleObj.activationNumber : activationNumber} onChange={number => this.setState({ activationNumber: number })} />
        </Form.Item>
        <Form.Item
          label="角色等级"
          required
          {...formItemLayout}
          style={{ marginBottom: '0' }}
        >
          <InputNumber name="grade" min={-1} max={1000} defaultValue={roleObj.grade !== undefined ? roleObj.grade : grade} onChange={number => this.setState({ grade: number })} placeholder="请输入角色等级" />
        </Form.Item>
        <Form.Item
          label="描述"
          required={false}
          {...formItemLayout}
          style={{ marginBottom: '0' }}
        >
          {getFieldDecorator('desc', {
            rules: [{ required: false }],
            initialValue: (roleObj.desc === undefined ? '' : roleObj.desc)
          })(
            <Input placeholder="请输入角色描述" type="text" maxLength={50} />
          )}

        </Form.Item>
        <div style={{ width: '100%', textAlign: 'center', marginTop: '1rem' }}>
          <Button key="back" onClick={this.props.handleCancel}>取消</Button>
          <Button key="submit" type="primary" loading={loading} onClick={this.addRole} style={{ marginLeft: '10px' }}>
            提交
            </Button>
        </div>
      </Form>
    );
  }
}
class AddUser extends Component {
  constructor(props) {
    super(props)
    this.state = {
      roles: [],
      loading: false
    }
  }
  getRole = () => {
    var roles = [{
      label: "代理商",
      value: 1
    }, {
      label: "企业用户",
      value: 2
    }];
    this.setState({
      roles: roles
    })
  }

  componentDidMount() {
    this.getRole();
  }
  addUser = (e) => { //添加用户
    e.preventDefault();
    this.setState({
      loading: true
    });
    this.props.form.validateFields((err, values) => {
      if (!err) {
        var data = {
          account: values.account,
          roleid: values.roleId
        };
        let thic = this;
        let promise = apiRequest.all("saveAdmin", data, "添加成功", null);
        promise.then(function (value) {
          if (value.code === 1) {
            thic.props.queryPage(0, thic.props.size, thic.props.name2 == undefined ? '' : thic.props.name2);
            thic.props.handleCancel();
          }
          thic.setState({
            loading: false
          });
        })
      }
    });
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 10 },
    };
    const { roles, loading } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form >
        <Form.Item
          label="账号"
          required
          {...formItemLayout}
          style={{ marginBottom: '0' }}
        >
          {getFieldDecorator('account', {
            rules: [{ required: true, message: '请填写您的账号' }],
          })(
            <Input placeholder="请输入账号" type="text" />
          )}
        </Form.Item>
        <Form.Item
          label="角色"
          required
          {...formItemLayout}
          style={{ marginBottom: '0' }}
        >
          {getFieldDecorator('roleId', {
            rules: [{ required: true, message: '请选择角色' }],
          })(
            <Select style={{ width: 120 }}>
              {
                roles.map((item, index) => {
                  return (
                    <Option value={item.value} key={index}>{item.label}</Option>
                  )
                })
              }
            </Select>
          )}
        </Form.Item>
        <div style={{ width: '100%', textAlign: 'center', marginTop: '1rem' }}>
          <Button key="back" onClick={this.props.handleCancel}>取消</Button>
          <Button key="submit" type="primary" loading={loading} onClick={this.addUser} style={{ marginLeft: '10px' }}>
            提交
            </Button>
        </div>
      </Form>
    )
  }
}

class AddMenu extends Component {

  state = {
    menus: []
  }
  componentDidMount() {
    this.getParents();
    console.log(this.props);
  }

  addOrUpdate = (e) => {
    e.preventDefault();
    var menu = this.props.menu;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (values.model !== undefined || values.url !== undefined) {
          var data = {
            name: values.name,
            parentId: values.parentId[values.parentId.length - 1],
            url: values.url === undefined ? "" : values.url,
            module: values.model === undefined ? "" : values.model
          }
          if (menu != undefined) {
            data.id = menu.id;
          }
          let promise = apiRequest.all("updateMenu", data, "更新成功", null);
          var thic = this;
          promise.then(function (value) {
            if (value.code === 1) {
              thic.props.queryPage(thic.props.name2 == undefined ? '' : thic.props.name2, thic.props.current, thic.props.size);
              thic.props.handleCancel();
            }
            thic.setState({
              loading: false
            });
          })
        } else {
          message.warning("访问地址或组件名称不能为空！", 3);
        }
      }
    })
  }

  getParents = () => {
    const { menus } = this.props;
    console.log(menus);
    const options = [{
      value: 0,
      label: '一级菜单',
      children: null,
    }];
    for (let i = 0; i < menus.length; i++) {
      let obj = menus[i];
      let option = {
        value: obj.id,
        label: obj.name,
        children: this.formatting(obj.children, obj.id)
      }
      options.push(option);
    }
    console.log(menus);
    this.setState({
      menus: options
    })
  }

  formatting = (children, parseId) => { //格式化数据
    const options = []
    let option = {
      value: parseId,
      label: "请选择",
    }
    options.push(option);
    if (children != undefined) {
      for (let i = 0; i < children.length; i++) {
        let obj = children[i];
        option = {
          value: obj.id,
          label: obj.name,
          children: this.formatting(obj.children)
        }
        options.push(option);
      }
    }
    return options;
  }

  option = (value, option) => {
    console.log(value);
    console.log(option);
  }

  render() {
    const { getFieldDecorator, } = this.props.form;
    const { menu } = this.props;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 12 },
    };

    return (
      <Form {...formItemLayout} onSubmit={this.addOrUpdate}>
        <Form.Item
          label="菜单名称"
        >
          {getFieldDecorator('name', {
            rules: [{
              required: true, message: '请填写菜单名称'
            }],
            initialValue: (menu === undefined ? '' : menu.name)
          })(
            <Input placeholder="请填写菜单名称" />
          )}
        </Form.Item>

        <Form.Item label="选择级别">
          {getFieldDecorator('parentId', {
            rules: [{
              required: true, message: '请选择菜单级别',
            }],
            initialValue: (menu === undefined ? '' : [menu.parentid])
          })(
            <Cascader options={this.state.menus} placeholder="请选择菜单级别" />
          )}
        </Form.Item>
        <Form.Item label="访问路径">
          {getFieldDecorator('url', {
            rules: [{
              required: false, message: '',
            }],
            initialValue: (menu === undefined ? '' : menu.url)
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item label="组件名称">
          {getFieldDecorator('model', {
            rules: [{
              required: false, message: '',
            }],
            initialValue: (menu === undefined ? '' : menu.module)
          })(
            <Input placeholder="请输入组件名称" />
          )}
        </Form.Item>
        <Form.Item style={{ textAlign: "center" }}>
          <Button key="back" onClick={this.props.handleCancel} style={{ marginRight: '1rem' }}>取消</Button>
          <Button type="primary" htmlType="submit" >提交</Button>
        </Form.Item>
      </Form>
    )
  }
}


class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
  };

  render() {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      ...restProps
    } = this.props;
    return (
      <EditableContext.Consumer>
        {(form) => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    rules: [{
                      required: true,
                      message: `Please Input ${title}!`,
                    }],
                    initialValue: record[dataIndex],
                  })(this.getInput())}
                </FormItem>
              ) : restProps.children}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [], editingKey: '', menuId: this.props.menuId, current: 0, pageSize: 5, total: 0, addDisplay: false };
    this.getFunctions();
    this.columns = [
      {
        title: 'key',
        dataIndex: 'key',
        editable: true,
      },
      {
        title: '功能名称',
        dataIndex: 'functionName',
        editable: true,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return (
            <div>
              {editable ? (
                <span>
                  <EditableContext.Consumer>
                    {form => (
                      <a
                        href="javascript:;"
                        onClick={() => this.save(form, record.id)}
                        style={{ marginRight: 8 }}
                      >
                        保存
                      </a>
                    )}
                  </EditableContext.Consumer>
                  <EditableContext.Consumer>
                    {form => (
                      <a
                        href="javascript:;"
                        onClick={() => {
                          if(record.id===''){
                            const index = this.state.data.findIndex(item =>  record.id === item.id);
                            this.state.data.splice(index,1);
                            this.setState({editingKey:'', data:this.state.datam,addDisplay:false})
                          }else{
                            this.setState({editingKey:'',addDisplay:false})
                          }
                        }}
                        style={{ marginRight: 8 }}
                      >
                        取消
                      </a>
                    )}
                  </EditableContext.Consumer>
                </span>
              ) : (
                  <div>
                    <a disabled={editingKey !== ''} onClick={() => this.edit(record.id)}>编辑</a>
                    &nbsp;&nbsp;
                    <EditableContext.Consumer>
                      {form => (
                        <a onClick={() => this.remove(form, record.id)}>删除</a>
                      )}
                    </EditableContext.Consumer>
                  </div>
                )}
            </div>
          );
        },
      },
    ];

  }
  getFunctions = () => { //根据菜单编号查询功能
    let { menuId, current, pageSize } = this.state;
    let thic = this;
    let promise = apiRequest.all("findByMenuId", menuId + "/" + (current * pageSize) + "/" + pageSize, null, "服务器丢了，请稍后重试！");
    promise.then(function (value) {
      if (value.code === 1) {
        thic.setState({
          data: value.data.data,
          total: value.data.total
        })
      }
    })
  }

  isEditing = record => record.id === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  save(form, id) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      if (id !== "") {
        row.id = id;
      }
      row.menuId = this.state.menuId;
      const index = this.state.data.findIndex(item => id === item.id);
      let promise = apiRequest.all("saveOrUpdate_SysMenuFunction", row, null, "服务器丢了，请稍后重试！");
      let thic = this;
      promise.then(function (value) {
        if (value.code === 1) {
          if (id === '') {
            row.id = value.data;
            thic.state.data[0] = row;
            thic.setState({
              data: thic.state.data
            })
          } else {
            thic.state.data[index] = row;
            thic.setState({
              data: thic.state.data
            })
          }

          thic.setState({
            editingKey: "",
            addDisplay: false
          })
          message.success(value.msg);
        }
      })
    });
  }

  remove = (form, id) => {  //删除
    form.validateFields((error, row) => {
      const index = this.state.data.findIndex(item => id === item.id);
      if (id === "") {
        this.state.data.shift(index, 1);
        this.setState({
          data: this.state.data,
          editingKey: "",
          addDisplay: false
        })
        return
      }
      let promise = apiRequest.all("removeFunction", id, null, "服务器丢了，请稍后重试！");
      let thic = this;
      promise.then(function (value) {
        if (value.code === 1) {
          thic.state.data.shift(index, 1);
          thic.setState({
            data: thic.state.data,
            editingKey: "",
            addDisplay: false
          })
          message.success(value.msg);
        }
      })
    });
  }

  edit(id) {
    console.log(id);
    this.setState({ editingKey: id });
  }

  addRow = () => { //添加行

    let item = {
      id: "",
      key: "",
      functionName: "",
      menuId: this.props.menuId
    }
    this.state.data.unshift(item);
    this.setState({
      data: this.state.data,
      editingKey: "",
      addDisplay: true
    })
  }
  render() {
    const components = {
      body: {
        cell: EditableCell,
      },
    };
    let { addDisplay, total } = this.state;
    console.log(total);
    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });
    return (
      <EditableContext.Provider value={this.props.form}>
        <Button type="primary" style={{ marginBottom: '1rem' }} disabled={addDisplay} onClick={this.addRow.bind(this)}>添加功能</Button>
        <Table
          components={components}
          bordered
          dataSource={this.state.data}
          columns={columns}
          rowClassName="editable-row"
          pagination={{
            pageSize: 5,
            onChange: (page, pageSize) => {
              this.setState({
                current: page - 1,
                pageSize: pageSize
              }, () => {
                this.getFunctions();
              })
            },
            total: total
          }}
        />
      </EditableContext.Provider>
    );
  }
}

const EditableFormTable = Form.create()(EditableTable);
const AddMenuFrom = Form.create()(AddMenu);
const AddUserFrom = Form.create()(AddUser);
const AddRoleFrom = Form.create()(AddRole);
