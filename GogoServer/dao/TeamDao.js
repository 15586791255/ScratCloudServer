function * getTeams(team_id, size) {
    if (team_id > 0) {
        return yield Conn.query('select * from team where team_id<? order by team_id desc limit ?',
            {replacements: [team_id, size], type: Sequelize.QueryTypes.SELECT});
    }

    return yield Conn.query('select * from team order by team_id desc limit ?',
        {replacements: [size], type: Sequelize.QueryTypes.SELECT});
}

function * getTeam(team_id) {
    return yield Conn.query('select * from team where team_id =? limit 1',
        {replacements: [team_id], type: Sequelize.QueryTypes.SELECT});
}

module.exports = {
    getTeams, getTeam
};