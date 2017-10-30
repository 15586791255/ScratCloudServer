const RaceDao = require('../dao/RaceDao');
const TeamDao = require('../dao/TeamDao');

const formatTeam = (team) => {
    if (!team) {
        return null;
    }

    delete team.delete_ts;
    delete team.tid;
    delete team.description;
    return team;
};

const formatRace = (race) => {
    if (!race) {
        return null;
    }
    delete race.delete_ts;
    delete race.mid;
    delete race.team_id_a;
    delete race.team_id_b;
    return race;
};

const getRaces = (req, res) => {
    let {index, size, status} = req.query;
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
        const races = yield RaceDao.getRaces(index, parseInt(size), status);
        let min_race_id = index;
        for (let race of races) {
            const [team_a] = yield TeamDao.getTeamByTid(race.team_id_a);
            const [team_b] = yield TeamDao.getTeamByTid(race.team_id_b);
            race.team_a = formatTeam(team_a);
            race.team_b = formatTeam(team_b);
            formatRace(race);
            if (min_race_id == 0 || min_race_id > race.race_id) {
                min_race_id = race.race_id
            }
        }
        if (races.length < size) {
            min_race_id = -1;
        }
        return BaseRes.success(res, {index: min_race_id, items: races});
    });
};

module.exports = {
    getRaces
};