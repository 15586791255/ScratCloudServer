const CommentDao = require('../dao/CommentDao');
const AccessTokenDao = require('../dao/AccessTokenDao');

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

module.exports = {
    addComment
};