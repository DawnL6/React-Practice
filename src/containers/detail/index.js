import React from 'react';
import { Form, Icon, Input, Button ,message,BackTop ,Mention } from 'antd';

import {connect} from 'react-redux';
import {getTheme,collect,cancelCollect,addStar,addReplies} from '../../action';
import {Link} from 'react-router';
import 'github-markdown-css';
import './index.css';
import 'antd/dist/antd.css';
const { toString, toEditorState } = Mention;
const FormItem = Form.Item;
const HorizontalLoginForm = Form.create()(React.createClass({
    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const userAcc = localStorage.getItem("loginname") || '';
                const {dispatch} = this.props;
                const data = {
                    id:this.props.detail.id,
                    content:values.content,
                    accesstoken:userAcc
                };
                dispatch(addReplies(data))
            }
        });
    },
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem>
                    {getFieldDecorator('content', {
                        rules: [{ required: true, message: '请输入你套提交的评论!' }],
                    })(
                        <Input type="textarea" rows={4} placeholder="提交评论" />
                    )}
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit">提交评论</Button>
                </FormItem>
            </Form>
        );
    },
}));

var Detail = React.createClass({
    getInitialState(){
      return{
          connect:'',
          showRep:-1
      }
    },
    componentWillMount(){
        const {dispatch} = this.props;
        const id = this.props.routeParams.id;
        dispatch(getTheme(id))
    },
    render(){
        const that = this;
        const {detail} = this.props.node;
        const author = detail.author || '';
        const distance = this.getTime(detail.last_reply_at) ||'';
        const loginname = localStorage.getItem("loginname") || '';
        const username = localStorage.getItem("username") || '';
        const tab = detail.tab || '';
        const content = detail.content || '';
        const end = tab.replace('ask', '问答').replace('job', '招聘').replace('share', '分享').replace('good', '精华');
        const _replies = detail.replies || [];
        const replies = _replies.map((obj,index)=>{
            let apdistance = this.getTime(obj.create_at);
            return (
                <div key={obj.id} className="items">
                    <div className="author_content">
                        <Link to={'user/'+obj.author.loginname}>
                            <img src={obj.author.avatar_url} alt=""/>
                            <span>{obj.author.loginname}</span>
                        </Link>
                        <span>{index+1}楼•{apdistance}</span>
                        <div className="user-action">
                            <span onClick={()=>this.addStar(obj.id)}><Icon type="like-o" />{obj.ups.length}</span>
                            <span onClick={()=>this.setState({showRep:index})}><Icon type="export" /></span>
                        </div>
                    </div>
                    <div className="reply-count">
                        <div dangerouslySetInnerHTML={{__html: obj.content}} />
                    </div>
                    {this.state.showRep === index ? <div>
                            <Mention
                                style={{ width: '100%', height: 100 }}
                                onChange={that.onChange}
                                defaultValue={toEditorState('@' + obj.author.loginname)}
                                suggestions={[obj.author.loginname]}
                                onSelect={that.onSelect}
                            />
                            <Button type="primary" onClick={()=>that.onRep(obj)}>提交</Button>
                        </div>:''}
                </div>
            )
        });
        return(
            <div className="detail">
                <p className="top"><Link to={`/`}>主页</Link>/详情页</p>
                <div className="header">
                   <h3>{detail.title}</h3>
                   <div className="changes">
                       <span>发布于{distance}</span>
                       <span>作者{author.loginname}</span>
                       <span>浏览次数{detail.visit_count}</span>
                       <span>来自{end}</span>
                       {username === author.loginname ? <Link to={'createtopic/'+detail.id}>编辑主题</Link> : ''}
                       <Button type="primary" style={{marginLeft:'50px'}} disabled={!loginname} onClick={detail.is_collect?this.cancelCollect:this.collect}>{detail.is_collect?'取消收藏':'收藏'}</Button>
                   </div>
                </div>
                <div className="content markdown-body">
                    <div dangerouslySetInnerHTML={{__html: content}} />
                </div>
                <div className="reply">
                    <p>{replies.length}&nbsp;条回复</p>
                    {replies}
                    <br/>
                    <HorizontalLoginForm detail={detail} dispatch={this.props.dispatch}/>
                </div>
                <div>
                    <BackTop>
                        <div className="ant-back-top-inner">UP</div>
                    </BackTop>
                </div>
            </div>
        )
    },
    componentWillReceiveProps(nextProps){
        const loginname = localStorage.getItem("loginname") || '';
        const collectNow = this.props.node.collect;
        const collectNext = nextProps.node.collect;
        if(loginname){
            if(collectNow !== collectNext && collectNext==='success'){
                const {dispatch} = this.props;
                const id = this.props.routeParams.id;
                dispatch(getTheme(id))
            }
            if(this.props.node.rep_success !== nextProps.node.rep_success && nextProps.node.rep_success==='success'){
                message.success('评论成功');
                const {dispatch} = this.props;
                const id = this.props.routeParams.id;
                dispatch(getTheme(id))
            }else if(this.props.node.rep_success !== nextProps.node.rep_success && nextProps.node.rep_success==='fail'){
                message.error('请先登陆');
            }
            if(this.props.node.star !== nextProps.node.star &&(nextProps.node.star === 'up'||nextProps.node.star === 'down')){
                message.success(nextProps.node.star === 'up'?'成功点赞':'取消点赞');
                const {dispatch} = this.props;
                const id = this.props.routeParams.id;
                dispatch(getTheme(id))
            }
        }else if((this.props.node.star !== nextProps.node.star && nextProps.node.star === 'fail') || (this.props.node.rep_success !== nextProps.node.rep_success && nextProps.node.rep_success === 'fail')){
            message.error('请先登录！');
        }
    },
    getTime(obj){
        let nowTime = new Date();
        const time = nowTime - new Date(obj);
        const year = Math.floor(time / 1000 /3600 / 24 / 365) + '年前';
        const month = Math.floor(time / 1000 /3600 / 24 / 30) + '个月前';
        const day = Math.floor(time / 1000 /3600 / 24) + '天前';
        const hour = Math.floor(time / 1000 /3600) + '小时前';
        const min = Math.floor(time / 1000 /60) + '分钟前';
        const second = Math.floor(time / 1000) + '秒前';
        const distance = (parseInt(year,10)?year:'') || (parseInt(month,10)?month:'') || (parseInt(day,10)?day:'') || (parseInt(hour,10)?hour:'') || (parseInt(min,10)?min:'') || second;
        return distance;
    },
    collect(){//收藏
        const {dispatch} = this.props;
        const loginname = localStorage.getItem("loginname") || '';
        const id = this.props.routeParams.id;
        dispatch(collect(id,loginname))
    },
    cancelCollect(){//取消收藏
        const {dispatch} = this.props;
        const loginname = localStorage.getItem("loginname") || '';
        const id = this.props.routeParams.id;
        dispatch(cancelCollect(id,loginname))
    },
    addStar(id){//点赞
        const {dispatch} = this.props;
        const userAcc = localStorage.getItem("loginname") || '';
        dispatch(addStar(id,userAcc))
    },
    onChange(editorState) {
        let content = toString(editorState);
        this.setState({
            connect : content
        });
        console.log(toString(editorState));
    },
    onSelect(suggestion) {
        console.log('onSelect', suggestion);
    },
    onRep(topic){
        console.log(this.props);
        const userAcc = localStorage.getItem("loginname") || '';
        const {node,dispatch} = this.props;
        const data = {
            id:node.detail.id,
            content:this.state.connect,
            accesstoken:userAcc,
            reply_id:topic.id
        };
        dispatch(addReplies(data));
        this.setState({
            showRep:-1
        })
    }

});
const mapStateToProps  = function (store) {
    return{
        node:store.node
    }
};
export default connect(mapStateToProps)(Detail)