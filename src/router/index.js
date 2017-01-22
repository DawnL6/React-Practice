import React from 'react';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';
import Head from '../containers/head';
import Main from '../containers/main';
import CreateTopic from '../containers/createtopic';
import Detail from '../containers/detail';
import UserInfo from '../containers/userinfo';
import Collect from '../containers/collect';
import Message from '../containers/messages';

var R = React.createClass({
    render(){
        return(
            <Router history={hashHistory}>
                <Route path="/" component={Head}>
                    <IndexRoute component={Main}/>
                    <Route path="/category/:categorySlug(/:pageNum)" component={Main} />
                </Route>
                <Route path="/user/:loginname" component={UserInfo} />
                <Route path="/collect/:loginname" component={Collect} />
                <Route path="/topic/:id" component={Detail} />
                <Route path="/createtopic(/:topicId)" component={CreateTopic} />
                <Route path="/message" component={Message} />
            </Router>
        )
    }
});
export default R;
