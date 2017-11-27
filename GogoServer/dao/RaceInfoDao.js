function * getRaceInfo(race_info_id) {
    return yield Conn.query('select * from race_info where race_info_id=? and race_name like "王者荣耀%" limit 1',
        {replacements: [race_info_id], type: Sequelize.QueryTypes.SELECT});
}

module.exports = {
    getRaceInfo
};