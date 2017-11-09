function * getAddress(uid) {
    return yield Conn.query('select * from address where uid=? and delete_ts=0 limit 1',
        {replacements: [uid], type: Sequelize.QueryTypes.SELECT})
}

function updateAddress(uid, address_detail, tel, location, receiver) {
    Conn.query('update address set tel=?, address_detail=?, location=?, receiver=?, update_ts=? where uid=?',
        {
            replacements: [tel, address_detail, location, receiver, new Date().getTime(), uid],
            type: Sequelize.QueryTypes.UPDATE
        })
}

function addAddress(uid, address_detail, tel, location, receiver) {
    Conn.query('insert ignore into address set uid=?, address_detail=?, tel=?, location=?, receiver=?, create_ts=?',
        {
            replacements: [uid, address_detail, tel, location, receiver, new Date().getTime()],
            type: Sequelize.QueryTypes.INSERT
        })
}

module.exports = {
    getAddress, updateAddress, addAddress
};