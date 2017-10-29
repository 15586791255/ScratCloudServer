function * getToken(uid, access_token) {
    return yield Conn.query('select * from access_token where uid=? and token=? order by token_id desc limit 1',
        {replacements: [uid, access_token], type: Sequelize.QueryTypes.SELECT});
}

module.exports = {
    getToken
};