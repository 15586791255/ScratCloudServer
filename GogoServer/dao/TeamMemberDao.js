function * getMembers(team_id) {
    return yield Conn.query('select * from team_member where team_id=?',
        {replacements: [team_id], type: Sequelize.QueryTypes.SELECT});
}

module.exports = {
    getMembers
};