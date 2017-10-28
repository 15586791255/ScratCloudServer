// const addSms = (tel, code) => {
//     const createTs = new Date().getTime();
//     const expiredTs = createTs + Config.expiredSmsInTs;
//     Conn.query('insert ignore into sms set tel=?,code=?,create_ts=?,expired_ts=?',
//         {replacements: [tel, code, createTs, expiredTs], type: Sequelize.QueryTypes.INSERT});
// };

function * getNews(news_id, size) {
    if (news_id > 0) {
        return yield Conn.query('select * from news where news_id<? order by news_id desc limit ?',
            {replacements: [news_id, size], type: Sequelize.QueryTypes.SELECT});
    }

    return yield Conn.query('select * from news order by news_id desc limit ?',
        {replacements: [size], type: Sequelize.QueryTypes.SELECT});
}

module.exports = {
    getNews
};