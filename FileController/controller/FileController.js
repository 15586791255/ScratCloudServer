const qiniu = require('qiniu');

const getToken = (req, res) => {
    const mac = new qiniu.auth.digest.Mac(Config.qiniuAccessKey, Config.qiniuSecretKey);

    const options = {
        scope: Config.qiniuBucket
    };
    const put_policy = new qiniu.rs.PutPolicy(options);
    const upload_token = put_policy.uploadToken(mac);

    BaseRes.success(res, {
        upload_token,
        domain: Config.qiniuDomain
    });
};

module.exports = {
    getToken
};