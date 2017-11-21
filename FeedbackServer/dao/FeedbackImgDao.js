function * addFeedbackImg(feedback_id, url) {
    const [insert_id, affected_rows] =
        yield Conn.query(
            'insert ignore into feedback_img set feedback_id=?,url=?',
            {replacements: [feedback_id, url], type: Sequelize.QueryTypes.INSERT});
    return insert_id;
}

module.exports = {
    addFeedbackImg
};