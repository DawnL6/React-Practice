import React from  'react';
import {connect} from 'react-redux';
import {getTopics,username,signOut,getMessageNum} from '../../action';
import {Link} from 'react-router';
import logo from '../../public/redux.png';
import {
    Icon,
    Form,
    Input,
    Button,
    Popover,
    BackTop,
    Spin,
    message,
    Badge
} from 'antd';
const FormItem = Form.Item;
import 'antd/dist/antd.css';
import './index.css';
var Head = React.createClass({
    getInitialState(){
        return{
            selected: 'all',
            loginname:'',
            visible: false,
            form: false
        }
    },
    getSlug() {
        let slugParam = this.props.params.categorySlug;
        slugParam = slugParam ? slugParam : 'all';
        return slugParam
    },
    componentWillMount(){
        const slugParam = this.getSlug();
        const {dispatch} = this.props;
        dispatch(getTopics());
        const username = localStorage.getItem("username") || '';
        const accesstoken = localStorage.getItem("loginname") || '';
        if(username){
            dispatch(getMessageNum(accesstoken));
        }
        this.setState({
            selected: slugParam,
            loginname: username
        })

    },
    render(){
        const tabList = ['all', 'good', 'share', 'ask', 'job'];
        const username = this.state.loginname;
        let that = this
        const HorizontalLoginForm = Form.create()(React.createClass({
            handleSubmit(e) {
                e.preventDefault();
                this.props.form.validateFields((err, values) => {
                    if (!err) {
                        console.log(values);
                        that.login(values)
                    }
                });
            },
            render() {
                const {
                    getFieldDecorator
                } = this.props.form;
                return (
                    <Form inline onSubmit={this.handleSubmit}>
                        <FormItem>
                            {getFieldDecorator('accesstoken', {
                                rules: [{required: true, message: 'Please input your username!'}],
                            })(
                                <Input addonBefore={<Icon type="user"/>} placeholder="请输入你的accesstoken"/>
                            )}
                        </FormItem>
                        <FormItem>
                            <Button type="primary" htmlType="submit">登陆</Button>
                        </FormItem>
                    </Form>
                );
            },
        }))
        return(
           <div className="container">
               <div className="login">
                   <Spin tip="Loading..." spinning={this.props.node.login === 'request'}>
                       <BackTop visibilityHeight='100'/>
                       <Popover
                           content={<a onClick={username ? this.signOut : this.signIn}>{username ? '退出' : '登陆'}</a>}
                           title="登陆/退出"
                           trigger="click"
                           visible={this.state.visible}
                           onVisibleChange={this.handleVisibleChange}
                       >
                           <Button type="primary">{username || '未登录'}</Button>
                       </Popover>
                       { !username || <Link to={'collect/'+username}>
                           <div className="collect">收藏列表</div>
                       </Link> }
                       { !username || <Link to={'user/'+username}>
                           <div className="collect">个人信息</div>
                       </Link> }
                   </Spin>
               </div>
               <div className="login-btn">
                   {this.state.form ? <HorizontalLoginForm /> : ''}
               </div>
               <div className="header">
                   <Link to='/'><img src={logo} alt="react" width="147px"/></Link>
                   {tabList.map((value, index) => {
                        const end = value.replace('ask', '问答').replace('job', '招聘').replace('share', '分享').replace('good', '精华').replace('all', '全部')
                        return <Link to={/category/+value} className={this.state.selected === value ? 'select':'list'} key={index}>{end}</Link>
                       }
                   )}
                   { !username || <Link to='/createtopic'  className="select" style={{float: 'right',marginRight:'50px'}}>
                       <span>发布话题</span>
                   </Link> }
                   { !username || <Link to='/message' className="unread" style={{float: 'right'}}>
                       <Badge count={this.props.message.messagesNum}>
                           <span className="head-example" style={{marginRight:'10px'}}>未读消息</span>
                       </Badge>
                   </Link> }
               </div>
               {this.props.children}
           </div>
        )
    },
    componentWillReceiveProps(nextProps){
        const cnodeNow = this.props.node;
        const cnodeNext = nextProps.node;
        const slug = nextProps.params.categorySlug
        const nextSlug = slug ? slug : 'all';
        if (this.getSlug() !== nextSlug) {
            this.setState({
                selected: nextSlug
            });
        }
        if(cnodeNow.login !== cnodeNext.login && cnodeNext.login === 'success'){
            message.success('登陆成功');
            const username = localStorage.getItem("username") || '';
            this.setState({
                form: false,
                loginname: username
            })
        }
        if (cnodeNow.login !== cnodeNext.login && cnodeNext.login === 'fail') {
            message.error('登陆失败');
        }
        if (cnodeNow.login !== cnodeNext.login && cnodeNext.login === 'leave') {
            message.error('成功退出');
            this.setState({
                loginname: ''
            })
        }
    },
    login(data){
        const {dispatch} = this.props;
        dispatch(username(data));
        this.setState({
            modal1Visible: false
        })
    },
    signIn(){
        this.setState({
            form: true,
            visible: false
        })
    },
    signOut(){
        const {dispatch} = this.props;
        this.setState({
            visible: false
        });
        dispatch(signOut());
        localStorage.clear("loginname", "username")
    },
    handleVisibleChange (visible){
        this.setState({
            visible
        })
    }
});
const mapStateToProps  = function (store) {
    return{
        node:store.node,
        message:store.message
    }
};
export default connect(mapStateToProps)(Head)
