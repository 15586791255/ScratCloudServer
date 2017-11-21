function * addFeedback(uid, title, content, app_key, ver_code, ver_name) {
    const now = new Date().getTime();
    const [insert_id, affected_rows] =
        yield Conn.query(
            'insert ignore into feedback set uid=?,title=?,content=?,app_key=?,ver_code=?,ver_name=?,create_ts=?',
            {replacements: [uid, title, content, app_key, ver_code, ver_name, now], type: Sequelize.QueryTypes.INSERT});
    return insert_id;
}

module.exports = {
    addFeedback
};