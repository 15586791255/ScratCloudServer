const CommentDao = require('../dao/CommentDao');
const AccessTokenDao = require('../dao/AccessTokenDao');
const AccountDao = require('../dao/AccountDao');
const CommentLikeDao = require('../dao/CommentLikeDao');

const addComment = (req, res) => {
    const {app_key, pt, uid, access_token} = req.headers;
    let {target_id, replay_comment_id, content, tp} = req.body;
    if (!app_key || !pt || !target_id || !content || !tp) {
        return BaseRes.paramError(res);
    }

    if (!uid || !access_token) {
        return BaseRes.tokenError(res, '请登陆');
    }

    if (!replay_comment_id) {
        replay_comment_id = 0;
    }

    Co(function *() {
        const [token] = yield AccessTokenDao.getToken(uid, access_token);
        if (!token) {
            return BaseRes.tokenError(res);
        }

        const now_ts = new Date().getTime();
        if (token.expired_ts < now_ts) {
            return BaseRes.tokenError(res);
        }

        const comment_id = yield CommentDao.addComment(uid, target_id, replay_comment_id, tp, content);
        if (comment_id == 0) {
            return BaseRes.serverError(res, '评论失败');
        }

        const [comment] = yield CommentDao.getComment(comment_id);
        if (!comment) {
            return BaseRes.serverError(res, '评论失败');
        }

        delete comment.delete_ts;

        return BaseRes.success(res, comment);
    });
};

const getComments = (req, res) => {
    let {index, size, tp, target_id} = req.query;

    if (!tp || !target_id) {
        return BaseRes.paramError(res);
    }

    if (!index) {
        index = 0
    } else if (index < 0) {
        return BaseRes.success(res, {index: -1, items: []});
    }

    if (!size) {
        size = 20;
    } else if (size > 60) {
        size = 60;
    } else if (size <= 0) {
        return BaseRes.success(res, {index: -1, items: []});
    }

    Co(function *() {
        const comments = yield CommentDao.getComments(index, tp, target_id, parseInt(size));
        let minIndex = index;
        let items = [];
        for (let item of comments) {
            delete item.delete_ts;
            if (minIndex == 0 || minIndex > item.comment_id) {
                minIndex = item.comment_id
            }
            // TODO 此处可优化
            const [account] = yield AccountDao.findByUid(item.uid);
            if (!account) {
                items.push({comment: item, user: {
                    username: '未知',
                    gender: 'unknown',
                    uid: item.uid,
                    avatar: ''
                }})
            } else {
                items.push({comment: item, user: {
                    username: account.username,
                    gender: account.gender,
                    uid: account.uid,
                    avatar: account.avatar
                }})
            }
        }
        if (comments.length < size) {
            minIndex = -1;
        }
        BaseRes.success(res, {index: minIndex, items: items});
    });
};

const addLike = (req, res) => {
    const {app_key, pt, uid, access_token} = req.headers;
    const {comment_id} = req.body;
    Co(function *() {
        const [token] = yield AccessTokenDao.getToken(uid, access_token);
        if (!token) {
            return BaseRes.tokenError(res);
        }

        const now_ts = new Date().getTime();
        if (token.expired_ts < now_ts) {
            return BaseRes.tokenError(res);
        }

        yield CommentLikeDao.addLike(uid, comment_id);
        BaseRes.success(res);
    });
};

const unLike = (req, res) => {
    const {app_key, pt, uid, access_token} = req.headers;
    const {comment_id} = req.body;
    Co(function *() {
        const [token] = yield AccessTokenDao.getToken(uid, access_token);
        if (!token) {
            return BaseRes.tokenError(res);
        }

        const now_ts = new Date().getTime();
        if (token.expired_ts < now_ts) {
            return BaseRes.tokenError(res);
        }

        yield CommentLikeDao.deleteLike(uid, comment_id);
        BaseRes.success(res);
    });
};

module.exports = {
    addComment, getComments, addLike, unLike
};