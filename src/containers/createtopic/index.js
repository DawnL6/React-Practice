import React from 'react';
import {connect} from 'react-redux';
import {hashHistory} from 'react-router';
import { Select ,Input,Button,message} from 'antd';
const Option = Select.Option;
import {newTopics,updateTopic,getTheme} from '../../action';
import {Link} from  'react-router';
import './index.css';
const style = {
    body: {
        width: '90%',
        backgroundColor: '#fff',
        margin: '10px auto',
        borderRadius: '8px'
    },
    content: {
        padding: '10px',
        borderTop: '1px solid #e5e5e5'
    },
    there: {
        color: '#999'
    },
    input_title: {
        width: '95%',
        margin: '0 auto 15px'
    },
    submit: {
        marginTop: '30px'
    }
}

var Create = React.createClass({
    getInitialState(){
      return{
          select : '',
          title : '',
          content : ''
      }
    },
    componentWillMount(){
        const topicId = this.props.params.topicId;
        const{dispatch} = this.props;
        if (topicId) {
            dispatch(getTheme(topicId))
        }
    },
    render(){
        const topicId = this.props.routeParams.topicId;
        return(
            <div className="wrapper">
                <p className="wrapper-title"><Link to={`/`}>主页</Link><span style={style.there}>/&nbsp;发布话题</span></p>
                <from id="create_topic" onSubmit={this.handleSubmit}>
                    <span>选择板块：</span>
                    <Select
                        style={{ width: 200 }}
                        optionFilterProp="children"
                        onSelect={this.handleSelect}
                    >
                        <Option value='' disabled>请选择</Option>
                        <Option value='share'>分享</Option>
                        <Option value='ask'>问答</Option>
                        <Option value='job'>招聘</Option>
                    </Select>
                    {this.state.select==='ask' ? <strong style={style.remind}>提问时，请遵循<a href="https://gist.github.com/alsotang/f654af8b1fff220e63fcb44846423e6d">《提问的智慧》</a>中提及的要点，以便您更接收到高质量回复。</strong> : ''}
                    {this.state.select==='job' ? <strong>为避免被管理员删帖，发帖时请好好阅读<a href="http://cnodejs.org/topic/541ed2d05e28155f24676a12">《招聘帖规范》</a></strong> : ''}
                    <Input
                        style={style.input_title}
                        value={ topicId ? this.props.node.detail.title : this.state.title }
                        onChange={(e)=>this.setState({title:e.target.value})}/>
                    <Input type="textarea"
                           rows={4}
                           onChange={(e)=>this.setState({content:e.target.value})}
                    />
                    <Button style={style.submit} type="primary" onClick={this.handleSubmit}>{ topicId ? '更新' : '发布' }话题</Button>
                </from>
            </div>
        )
    },
    componentWillReceiveProps(nextProps){
        const topicId = this.props.routeParams.topicId;
        if (this.props.collect.create !== nextProps.collect.create && nextProps.collect.create === 'success') {
            message.success(topicId ?'更新成功':'创建成功');
            hashHistory.push('/');
        }
        if (this.props.collect.create !== nextProps.collect.create && nextProps.collect.create === 'fail') {
            message.error(topicId ?'更新失败':'创建失败');
        }
    },
    handleSelect(value){
        this.setState({
            select:value
        })
    },
    handleSubmit(){
        const{dispatch} = this.props;
        const topicId = this.props.routeParams.topicId;
        const userAcc = localStorage.getItem("loginname") || '';
        const title = this.state.title;
        const tab = this.state.select;
        const content = this.state.content;
        let data = {
            accesstoken: userAcc,
            title: title,
            tab: tab,
            content: content
        };
        console.log(data);
        if (!topicId) {
            dispatch(newTopics(data))
        } else {
            dispatch(updateTopic(data,topicId));
        }
    }
});
const mapStateToProps  = function (store) {
    return{
        collect:store.collect,
        node : store.node
    }
};
export default connect(mapStateToProps)(Create)