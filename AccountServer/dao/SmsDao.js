const addSms = (tel, code) => {
    const createTs = new Date().getTime();
    const expiredTs = createTs + Config.expiredSmsInTs;
    Conn.query('insert ignore into sms set tel=?,code=?,create_ts=?,expired_ts=?',
        {replacements: [tel, code, createTs, expiredTs], type: Sequelize.QueryTypes.INSERT});
};

function * findByTelAndCode(tel, code) {
    return yield Conn.query('select * from sms where tel=? and code=? order by sms_id desc limit 1',
        {replacements: [tel, code], type: Sequelize.QueryTypes.SELECT});
}

module.exports = {
    addSms, findByTelAndCode
};