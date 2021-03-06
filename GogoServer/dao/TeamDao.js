function * getTeams(team_id, size) {
    if (team_id > 0) {
        return yield Conn.query('select * from team where team_id>? limit ?',
            {replacements: [team_id, size], type: Sequelize.QueryTypes.SELECT});
    }

    return yield Conn.query('select * from team limit ?',
        {replacements: [size], type: Sequelize.QueryTypes.SELECT});
}

function * getTeam(team_id) {
    return yield Conn.query('select * from team where team_id=? limit 1',
        {replacements: [team_id], type: Sequelize.QueryTypes.SELECT});
}

function * getTeamByTid(tid) {
    return yield Conn.query('select * from team where tid=? limit 1',
        {replacements: [tid], type: Sequelize.QueryTypes.SELECT});
}

module.exports = {
    getTeams, getTeam, getTeamByTid
};