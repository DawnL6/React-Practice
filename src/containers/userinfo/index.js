import React from 'react';
import {connect} from 'react-redux';
import {getUserInfo} from '../../action';
import {Link} from 'react-router'
import {Icon} from 'antd';
import Topics from '../topics';
import 'antd/dist/antd.css';
import './index.css';
var Info = React.createClass({
    render(){
        const{userinfo} = this.props.node;
        const recent_replies = userinfo.recent_replies || [];
        const recent_topics = userinfo.recent_topics || [];
        let nowTime = new Date();
        const time = nowTime - new Date(userinfo.create_at);
        const year = Math.floor(time / 1000 /3600 / 24 / 365) + '年前';
        const month = Math.floor(time / 1000 /3600 / 24 / 30) + '个月前';
        const day = Math.floor(time / 1000 /3600 / 24) + '天前';
        const hour = Math.floor(time / 1000 /3600) + '小时前';
        const min = Math.floor(time / 1000 /60) + '分钟前';
        const second = Math.floor(time / 1000) + '秒前';
        const distance = (parseInt(year,10)?year:'') || (parseInt(month,10)?month:'') || (parseInt(day,10)?day:'') || (parseInt(hour,10)?hour:'') || (parseInt(min,10)?min:'') || second;
        return(
            <div className="info">
                <div className="info-left">
                    <header><Link to="/">主页 /</Link></header>
                    <div className="user">
                        <div className="user-img">
                            <img src={userinfo.avatar_url} alt=""/>
                            <span>{userinfo.loginname}</span>
                        </div>
                        <p className="score">{userinfo.score}&nbsp;积分</p>
                        <Link to={'collect/'+userinfo.loginname}><p style={{fontSize:'14px',textIndent:'15px'}}>话题收藏</p></Link>
                        <p className="github"><Icon type="clock-circle-o" style={{fontSize:'18px',margin:'5px 12px'}}/><span>{distance}</span></p>
                        <p className="github"><Icon type="github" style={{fontSize:'18px',margin:'5px 12px'}}/><a href={'https://github.com/'+userinfo.githubUsername}>@{userinfo.githubUsername}</a></p>
                        <p className="github"><Icon type="home" style={{fontSize:'18px',margin:'5px 12px'}}/><a href={'https://github.com/'+userinfo.githubUsername}>https://github.com/{userinfo.githubUsername}</a></p>
                    </div>
                    <div className="content">
                        <p className="title1">最近创建的话题</p>
                        {recent_topics.length===0 ? <div className="none">无话题</div> : <Topics topics={recent_topics} />}
                    </div>
                    <div className="content">
                        <p className="title1">最近参与的话题</p>
                        {recent_replies.length===0 ? <div className="none">无话题</div> : <Topics topics={recent_replies} />}
                    </div>
                </div>
                <div className="info-right">
                    <header>个人信息</header>
                    <div>
                        <div className="user-img">
                            <img src={userinfo.avatar_url} alt=""/>
                            <span>{userinfo.loginname}</span>
                        </div>
                        <p className="score">{userinfo.score}&nbsp;积分</p>
                        <p className="score">"这家伙很懒，什么个性签名都没留下"</p>
                    </div>
                </div>
            </div>
        )
    },
    componentWillMount(){
        const {dispatch} = this.props;
        const loginname = this.props.routeParams.loginname;
        dispatch(getUserInfo(loginname))
    }
});
const mapStateToProps  = function (store) {
    return{
        node:store.node
    }
};
export default connect(mapStateToProps)(Info)