import React from  'react';
import {connect} from 'react-redux';
import {getTopics} from '../../action';
import Topics from '../topics';
import {Pagination } from 'antd';
import 'antd/dist/antd.css';
import {hashHistory} from 'react-router';
var Main = React.createClass({
    componentWillReceiveProps(nextProps){
        const {dispatch} = this.props;
        const param = parseInt(nextProps.params.pageNum, 10);
        const slug = nextProps.params.categorySlug;
        const nextParam = isNaN(param) ? 1 : param;
        const nextSlug = slug ? slug : 'all';
        if(this.getPageNow() !== nextParam){
            dispatch(getTopics({
                page: nextParam,
                tab: nextSlug
            }))
        }
        if(this.getSlug() !== nextSlug){
            dispatch(getTopics({
                tab: nextSlug
            }))
        }
    },
    onChange(query){
        var path = 'category/'+this.getSlug()+'/'+query;
        hashHistory.push(path);
    },
    getSlug() {
        let slugParam = this.props.params.categorySlug;
        slugParam = slugParam ? slugParam : 'all';
        return slugParam
    },
    getPageNow() {
        let pageParam = parseInt(this.props.params.pageNum,10);
        pageParam = isNaN(pageParam) ? 1 : pageParam;
        return pageParam
    },
    render(){
        const {node} = this.props;
        const {topicList} = node;
        const topics = topicList.data;
        return(
            <div className="main">
                <Topics topics={topics} sluge={this.getSlug()} />
                <div style={{marginTop:'20px',marginLeft:'15px'}}>
                    <Pagination current={this.getPageNow()} pageSize={this.props.node.limit} total={500} onChange={this.onChange}/>
                </div>
            </div>
        )
    },

});
const mapStateToProps  = function (store) {
    return{
        node:store.node
    }
};
export default connect(mapStateToProps)(Main)

