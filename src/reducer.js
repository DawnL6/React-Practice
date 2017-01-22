import {combineReducers} from 'redux';
const initialState = {
    topicList: {},
    page: 1,
    limit: 0,
    tab: '',
    login:'',
    collect:'',
    userinfo: {},
    detail:{},
    star:'',
    rep_success:''
};
const node = function (state=initialState, action) {
    switch (action.type){
        case 'GET_TOPICS_SUCCESS':
            return Object.assign({},state,{
                topicList:action.list,
                page: action.pageName,
                limit: action.limit,
                tab: action.tab,
            });
        case 'LOGIN_USER_SUCCESS':
            return ({
                ...state,
                login: action.login
            });
        case 'LOGIN_USER_FAIL':
            return ({
                ...state,
                login: action.login
            });
        case 'LOGIN_USER_REQUEST':
            return ({
                ...state,
                login: action.login
            });
        case 'SIGN_OUT':
            return ({
                ...state,
                login: action.status
            });
        case 'GET_USER_INFO':
            return ({
                ...state,
                userinfo: action.userinfo
            });
        case 'GET_TOPIC_DETAIL':
            return ({
                ...state,
                detail: action.detail
            });
        case 'COLLECT_REQUEST':
            return ({
                ...state,
                collect: action.collect
            });
        case 'COLLECT_SUCCESS':
            return ({
                ...state,
                collect: action.collect
            });
        case 'DEL_COLLECT_SUCCESS':
            return ({
                ...state,
                collect: action.collect
            });//点赞
        case 'ADD_STAR_REQUEST':
            return({
                ...state,
                star : action.star
            });
        case 'ADD_STAR_SUCCESS':
            return({
                ...state,
                star : action.star
            });
        case 'ADD_STAR_FAIL':
            return({
                ...state,
                star : action.star
            });
        case 'REPLIES_REQUEST':
            return({
                ...state,
                rep_success : action.rep_success
            });
        case 'REPLIES_FAIL':
            return({
                ...state,
                rep_success : action.rep_success
            });
        case 'REPLIES_SUCCESS':
            return({
                ...state,
                rep_success : action.rep_success
            })
    }
    return state
};
const collect = function (
    state={
        collect:[],
        update:''
    },
    action) {
    switch (action.type){
        case 'GET_COLLECT_SUCCESS':
            return({
                ...state,
                collect : action.collect
            });
        case 'NEW_TOPIC_REQUEST':
            return ({
                ...state,
                create: action.create
            });
        case 'CREATE_TOPIC_FAIL':
            return ({
                ...state,
                create: action.create
            });
        case 'CREATE_TOPIC-SUCCESS':
            return ({
                ...state,
                create: action.create
            });
        case 'UPDATE_TOPIC_REQUEST':
            return ({
                ...state,
                create: action.update
            });
        case 'UPDATE_TOPIC_FAIL':
            return ({
                ...state,
                create: action.update
            });
        case 'UPDATE_TOPIC_SUCCESS':
            return ({
                ...state,
                create: action.update
            })
    }
    return state
};
const message = function (
    state={
        messagesNum:'',
        has_read_messages:[],
        hasnot_read_messages:[],
        mark :''
    },
    action) {
    switch (action.type){
        case 'GET_MESSAGE_NUM':
            return({
                ...state,
                messagesNum : action.messagesNum
            });
        case 'GET_MESSAGES':
            return({
                ...state,
                has_read_messages : action.has_read_messages,
                hasnot_read_messages : action.hasnot_read_messages
            });
        case 'MARK_ALL-REQUEST':
            return({
                ...state,
                mark : action.mark
            });
        case 'MARK_ALL-SUCCESS':
            return({
                ...state,
                mark : action.mark
            });
        case 'MARK_ALL-FAIL':
            return({
                ...state,
                mark : action.mark
            })
    }
    return state
};
const reducer = combineReducers({
    node,
    collect,
    message
});
export default reducer
