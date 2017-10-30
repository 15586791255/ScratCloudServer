const TeamDao = require('../dao/TeamDao');

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
        let min_index = index;
        for (let item of teams) {
            delete item.delete_ts;
            if (min_index == 0 || min_index > item.team_id) {
                min_index = item.team_id
            }
        }
        if (teams.length < size) {
            min_index = -1;
        }
        BaseRes.success(res, {index: min_index, items: teams});
    });
};

module.exports = {
    getTeams
};