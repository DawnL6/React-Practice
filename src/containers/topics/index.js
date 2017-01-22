import React from  'react';
import {Link} from 'react-router';
import './index.css';
var Topics = React.createClass({
    render(){
        const {topics} = this.props;
        let nodes = topics&&topics.map(obj => {
                let nowTime = new Date();
                const time = nowTime - new Date(obj.last_reply_at);
                const year = Math.floor(time / 1000 /3600 / 24 / 365) + '年前';
                const month = Math.floor(time / 1000 /3600 / 24 / 30) + '个月前';
                const day = Math.floor(time / 1000 /3600 / 24) + '天前';
                const hour = Math.floor(time / 1000 /3600) + '小时前';
                const min = Math.floor(time / 1000 /60) + '分钟前';
                const second = Math.floor(time / 1000) + '秒前';
                const end1 = (obj.tab === 'ask') ? '问答' : '';
                const end2 = (obj.tab === 'job') ? '招聘' : '';
                const end3 = (obj.tab === 'share') ? '分享' : '';
                const end4 = (obj.top === true) ? '置顶' : '';
                const end5 = (obj.good === true) ? '精华' : '';
                const distance = (parseInt(year,10)?year:'') || (parseInt(month,10)?month:'') || (parseInt(day,10)?day:'') || (parseInt(hour,10)?hour:'') || (parseInt(min,10)?min:'') || second;
                return (<div key={obj.id} className="user-lists">
                    <div className="user-info">
                        <Link to={'user/'+obj.author.loginname}><img alt="Avatar" src={obj.author.avatar_url} className="author"/></Link>
                        <span className="reply-count">{obj.reply_count || '0'}/{obj.visit_count || '0'}</span>
                        {(!obj.top && !obj.good) ? <span className="top top-tab">{end3||end2||end1||'未知'}</span> : <span className="top put-top">{end4||end5}</span>}
                        <Link to={'topic/'+obj.id} className="title">{obj.title}</Link>
                    </div>
                    <span className="time">{distance}</span>
                </div>);
        });
        return(
            <div className="content">
                {nodes}
            </div>
        )
    }
});
export default Topics;
