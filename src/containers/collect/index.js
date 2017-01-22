import React from 'react';
import {connect} from 'react-redux';
import {getCollect} from '../../action';
import {Link} from 'react-router';
import Topics from '../topics';
import './index.css';
var Collect = React.createClass({
    componentWillMount(){
        const {dispatch} = this.props;
        const loginname = this.props.routeParams.loginname;
        dispatch(getCollect(loginname))
    },
    render(){
        const {collect} = this.props;
        const collects = collect.collect||[];
        return(
            <div className="collect-content">
                <p><Link to={`/`}>主页</Link>/{this.props.routeParams.loginname}的收藏</p>
                {collects.length === 0 ?<div>这家伙没有收藏</div>:<Topics topics={collects} />}
            </div>
        )
    }
});
const mapStateToProps  = function (store) {
    return{
        collect:store.collect
    }
};
export default connect(mapStateToProps)(Collect)