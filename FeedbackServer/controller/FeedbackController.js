const FeedbackDao = require('../dao/FeedbackDao');
const FeedbackImgDao = require('../dao/FeedbackImgDao');

const addFeedback = (req, res) => {
    const {app_key, pt, uid} = req.headers;
    let {title, content, ver_code, ver_name, imgs} = req.body;
    Co(function *() {
        const feedback_id = yield FeedbackDao.addFeedback(uid, title, content, app_key, ver_code, ver_name);
        if (feedback_id <= 0) {
            BaseRes.serverError(res);
        }
        if (imgs) {
            for (let img of imgs) {
                yield FeedbackImgDao.addFeedbackImg(feedback_id, img);
            }
        }
        BaseRes.success(res);
    });
};

module.exports = {
    addFeedback
};