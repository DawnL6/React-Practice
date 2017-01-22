import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {getMessages,getMark} from '../../action';
import {Button,message} from 'antd';
import './index.css';
var Message = React.createClass({
    componentWillMount(){
        const {dispatch} = this.props;
        const accesstoken = localStorage.getItem("loginname") || '';
        dispatch(getMessages(accesstoken))
    },
    render(){
        const{message} = this.props;
        const has_read_messages = message.has_read_messages || [];
        const hasnot_read_messages = message.hasnot_read_messages || [];
        const has = has_read_messages.map((obj)=>{
            return(
                obj.type === 'at'?
                <div key={obj.id} className="items">
                    <Link to={'user/'+obj.author.loginname}>{obj.author.loginname}</Link><span style={{margin:'0 5px'}}>在话题</span>
                    <Link to={`/topic/${obj.topic.id}`}>{obj.topic.title}</Link>中{obj.type.replace('at', '@')}了你
                </div> :
                <div key={obj.id} className="items">
                    <Link to={'user/'+obj.author.loginname}>{obj.author.loginname}</Link><span style={{margin:'0 5px'}}>回复了你的话题</span>
                    <Link to={'topic/'+obj.topic.id}>{obj.topic.title}</Link>
                </div>
            )
        });
        const hasnot = hasnot_read_messages.map((obj)=>{
            return(
                obj.type === 'at'?
                    <div key={obj.id} className="items">
                        <Link to={'user/'+obj.author.loginname}>{obj.author.loginname}</Link><span style={{margin:'0 5px'}}>在话题</span>
                        <Link to={`/topic/${obj.topic.id}`}>{obj.topic.title}</Link>中{obj.type.replace('at', '@')}了你
                    </div> :
                    <div key={obj.id} className="items">
                        <Link to={'user/'+obj.author.loginname}>{obj.author.loginname}</Link><span style={{margin:'0 5px'}}>回复了你的话题</span>
                        <Link to={'topic/'+obj.topic.id}>{obj.topic.title}</Link>
                    </div>
            )
        });
        return(
            <div className="message">
                <div className="panel">
                    <p><Link to={`/`}>主页</Link><span style={{marginRight:'30px'}}>/新消息</span>
                        {hasnot_read_messages.length === 0 ? '':<Button type="primary" onClick={this.markAll}>全部标记为已读</Button>}
                    </p>

                    {hasnot_read_messages.length === 0 ? <div className="no">暂无消息！</div>:hasnot}

                </div>
                <div className="panel">
                    <p>过往消息</p>
                    {has_read_messages.length === 0 ? <div className="no">暂无消息！</div>:has}
                </div>
            </div>
        )
    },
    componentWillReceiveProps(nextProps){
        if(this.props.message.mark !== nextProps.message.mark && nextProps.message.mark === 'success'){
            message.success('已全部标记为已读');
            const {dispatch} = this.props;
            const accesstoken = localStorage.getItem("loginname") || '';
            dispatch(getMessages(accesstoken))
        }
        if(this.props.message.mark !== nextProps.message.mark && nextProps.message.mark === 'fail'){
            message.error('标记出错');
        }
    },
    markAll(){
        const {dispatch} = this.props;
        const accesstoken = localStorage.getItem("loginname") || '';
        dispatch(getMark(accesstoken))
    }
});
const mapStateToProps  = function (store) {
    return{
        message:store.message
    }
};
export default connect(mapStateToProps)(Message)