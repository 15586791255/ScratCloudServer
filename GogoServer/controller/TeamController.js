const TeamDao = require('../dao/TeamDao');
const TeamMemberDao = require('../dao/TeamMemberDao');

const getTeams = (req, res) => {
    let {index, size} = req.query;
    if (!index) {
        index = 0
    } else if (index < 0) {
        return BaseRes.success(res, {index: -1, items: []});
    }

    if (!size) {
        size = 20;
    } else if (size > 60) {
        size = 60;
    } else if (size <= 0) {
        return BaseRes.success(res, {index: -1, items: []});
    }

    Co(function *() {
        const teams = yield TeamDao.getTeams(index, parseInt(size));
        let max_index = -1;
        for (let item of teams) {
            delete item.description;
            delete item.delete_ts;
            delete item.tid;
            if (max_index == 0 || max_index < item.team_id) {
                max_index = item.team_id
            }
        }
        BaseRes.success(res, {index: max_index, items: teams});
    });
};

const getTeam = (req, res) => {
    const {team_id} = req.params;

    Co(function *() {
        const [team] = yield TeamDao.getTeam(team_id);
        if (!team) {
            return BaseRes.notFoundError(res);
        }

        delete team.delete_ts;
        delete team.tid;

        const members = yield TeamMemberDao.getMembers(team_id);

        for (let member of members) {
            delete member.delete_ts;
            delete member.mid;
            delete member.tid;
        }

        BaseRes.success(res, {team, members});
    });
};

module.exports = {
    getTeams, getTeam
};