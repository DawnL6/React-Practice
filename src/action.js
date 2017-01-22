import request from 'superagent';
let defaultQuery = {
    page: 1,
    limit: 20,
    tab: 'all'
};
//获得主体
export function getTopics(query = defaultQuery) {
    const url = "https://cnodejs.org/api/v1/topics";
    let postQuery = {...defaultQuery, ...query};
    return function (dispatch) {
        request
            .get(url)
            .query(postQuery)
            .end(function (err, res) {
                dispatch({
                    type: 'GET_TOPICS_SUCCESS',
                    list : res.body,
                    pageName : postQuery.page,
                    limit: postQuery.limit,
                    tab : postQuery.tab,
                    loading : 'success'
                })
            })
    }
}
//用户登录
export function username(data) {
    const url = 'https://cnodejs.org/api/v1/accesstoken';
    return function (dispatch) {
        dispatch({
            type: 'LOGIN_USER_REQUEST',
            login: 'request'
        });
        request
            .post(url,data)
            .end(function (err, res) {
                if(err){
                    console.log(err);
                    dispatch({
                        type: 'LOGIN_USER_FAIL',
                        login: 'fail'
                    })
                }else{
                    console.log(res.body.loginname);
                    localStorage.setItem('loginname', data.accesstoken);
                    localStorage.setItem('username', res.body.loginname);
                    dispatch({
                        type: 'LOGIN_USER_SUCCESS',
                        login: 'success'
                    })
                }
            })
    }
}
//用户登出
export const signOut = () => ({
    type: 'SIGN_OUT',
    status: 'leave'
});

//用户信息
export function getUserInfo(loginname) {
    const url = 'https://cnodejs.org/api/v1/user/'+loginname;
    return function (dispatch) {
        request
            .get(url)
            .end(function (err,res) {
                if(err){
                    console.log(err)
                }else{
                    dispatch({
                        type : 'GET_USER_INFO',
                        userinfo : res.body.data
                    })
                }
            })
    }
}
//用户主体详情
export function getTheme(id) {
    const url = 'https://cnodejs.org/api/v1/topic/'+id;
    const accesstoken = localStorage.getItem("loginname") || '';
    return function (dispatch) {
        request
            .get(url)
            .query({
                accesstoken: accesstoken
            })
            .end(function (err,res) {
                if(err){
                    console.log(err)
                }else{
                    dispatch({
                        type: 'GET_TOPIC_DETAIL',
                        detail: res.body.data
                    })
                }
            })
    }
}

//收藏主题
export function collect(id,userAcc) {
    const url = 'https://cnodejs.org/api/v1/topic_collect/collect';
    return function (dispatch) {
        dispatch({
            type: 'COLLECT_REQUEST',
            collect : 'request',
        });
        request
            .post(url,{
                accesstoken:userAcc,
                topic_id : id
            })
            .end(function (err,res) {
                if(err){
                    console.log(err)
                }else{
                    dispatch({
                        type: 'COLLECT_SUCCESS',
                        collect : 'success',
                    });
                }
            })
    }
}
//取消主题
export function cancelCollect(id,userAcc) {
    const url = 'https://cnodejs.org/api/v1/topic_collect/de_collect';
    return function (dispatch) {
        dispatch({
            type: 'COLLECT_REQUEST',
            collect : 'request',
        });
        request
            .post(url,{
                accesstoken:userAcc,
                topic_id : id
            })
            .end(function (err,res) {
                if(err){
                    console.log(err)
                }else{
                    dispatch({
                        type: 'DEL_COLLECT_SUCCESS',
                        collect : 'success',
                    });
                }
            })
    }
}

//点赞
export function addStar(id,userAcc) {
    const url = 'https://cnodejs.org/api/v1/reply/'+ id +'/ups';
    return function (dispatch) {
        dispatch({
            type: 'ADD_STAR_REQUEST',
            star : 'request',
        });
        request
            .post(url,{
                accesstoken:userAcc,
            })
            .end(function (err,res) {
                if(err){
                    dispatch({
                        type: 'ADD_STAR_FAIL',
                        star : 'fail',
                    });
                }else{
                    dispatch({
                        type: 'ADD_STAR_SUCCESS',
                        star : res.body.action,
                    });
                }
            })
    }
}

//新建评论
export function addReplies(query) {
    const url = 'https://cnodejs.org/api/v1/topic/'+query.id+'/replies';
    return function (dispatch) {
        dispatch({
            type: 'REPLIES_REQUEST',
            rep_success: 'request'
        });
        request
            .post(url,query)
            .end(function (err,res) {
                if(err){
                    dispatch({
                        type: 'REPLIES_FAIL',
                        rep_success: 'fail'
                    });
                }else{
                    dispatch({
                        type: 'REPLIES_SUCCESS',
                        rep_success: 'success'
                    });
                }
            })
    }
}

//获得用户收藏列表
export function getCollect(username) {
    const url = 'https://cnodejs.org/api/v1/topic_collect/'+username;
    return function (dispatch) {
        request
            .get(url)
            .end(function (err,res) {
                if(err){
                   console.log(err)
                }else{
                    dispatch({
                        type : 'GET_COLLECT_SUCCESS',
                        collect : res.body.data
                    });
                }
            })
    }
}
//获得用户未读消息条数
export function getMessageNum(userAcc) {
    const url = 'https://cnodejs.org/api/v1/message/count';
    return function (dispatch) {
        request
            .get(url)
            .query({
                accesstoken:userAcc
            })
            .end(function (err,res) {
                if(err){
                    console.log(err)
                }else{
                    dispatch({
                        type:'GET_MESSAGE_NUM',
                        messagesNum:res.body.data
                    })
                }
            })
    }
}

//获取已读和未读消息
export function getMessages(userAcc) {
    const url = 'https://cnodejs.org/api/v1/messages';
    return function (dispatch) {
        request
            .get(url)
            .query({
                accesstoken:userAcc
            })
            .end(function (err,res) {
                if(err){
                    console.log(err)
                }else{
                    console.log(res.body.data);
                    dispatch({
                        type :'GET_MESSAGES',
                        has_read_messages : res.body.data.has_read_messages,
                        hasnot_read_messages : res.body.data.hasnot_read_messages
                    });
                }
            })
    }
}

//获得用户未读消息条数
export function getMark(userAcc) {
    const url = 'https://cnodejs.org/api/v1/message/mark_all';
    return function (dispatch) {
        dispatch({
            type : 'MARK_ALL-REQUEST',
            mark : 'request'
        });
        request
            .post(url,{
                accesstoken:userAcc
            })
            .end(function (err,res) {
                if(err){
                    dispatch({
                        type : 'MARK_ALL-FAIL',
                        mark : 'fail'
                    });
                }else{
                    dispatch({
                        type : 'MARK_ALL-SUCCESS',
                        mark : 'success'
                    });
                }
            })
    }
}
//发布主题
export function newTopics(query) {
    const url = 'https://cnodejs.org/api/v1/topics';
    console.log(query);
    return function (dispatch) {
        dispatch({
            type : 'NEW_TOPIC_REQUEST',
            create : 'request'
        });
        request
            .post(url,query)
            .end(function (err,res) {
                if(err){
                    dispatch({
                        type : 'CREATE_TOPIC_FAIL',
                        create : 'fail',
                    });
                }else{
                    console.log(res);
                    dispatch({
                        type : 'CREATE_TOPIC-SUCCESS',
                        create : 'success'
                    });
                }
            })
    }
}
//更新主题
export function updateTopic(query,topic_id) {
    const url = 'https://cnodejs.org/api/v1/topics/update';
    const post_data = {...query,
        topic_id
    };
    return function (dispatch) {
        dispatch({
            type: 'UPDATE_TOPIC_REQUEST',
            update: 'request'
        });
        console.log(post_data);
        request
            .post(url,post_data)
            .end(function (err,res) {
                if(err){
                    dispatch({
                        type: 'UPDATE_TOPIC_FAIL',
                        update: 'fail'
                    })
                }else{
                    dispatch({
                        type: 'UPDATE_TOPIC_SUCCESS',
                        update: 'success'
                    })
                }
            })
    }
}