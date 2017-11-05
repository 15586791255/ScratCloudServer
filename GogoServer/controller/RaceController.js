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
    delete race.dt;
    return race;
};

const getRaces = (req, res) => {
    let {index, size} = req.query;
    if (!index) {
        index = 0
    } else if (index < 0) {
        return BaseRes.success(res, {index: -1, items: []});
    }

    if (!size) {
        size = 7;
    } else if (size > 60) {
        size = 60;
    } else if (size <= 0) {
        return BaseRes.success(res, {index: -1, items: []});
    }

    Co(function *() {
        const race_dt_list = yield RaceDao.getRaceDtList();

        const dt_list = [];
        let res_index = -1;
        let curr_size = size;
        for (let item of race_dt_list) {
            if (index > 0 && item.dt >= index) {
                continue;
            }
            res_index = item.dt;
            dt_list.push(item.dt);
            curr_size--;
            if (curr_size <= 0) {
                break;
            }
        }

        const res_item_objects = {};
        const races = yield RaceDao.getRacesByDt(dt_list);
        for (let race of races) {
            const [team_a] = yield TeamDao.getTeamByTid(race.team_id_a);
            const [team_b] = yield TeamDao.getTeamByTid(race.team_id_b);
            race.team_a = formatTeam(team_a);
            race.team_b = formatTeam(team_b);
            const curr_dt = race.dt;
            let item_obj = res_item_objects[curr_dt];
            if (!item_obj) {
                item_obj = {dt: curr_dt, items: []};
            }
            formatRace(race);
            item_obj.items.push(race);
            res_item_objects[curr_dt] = item_obj;
        }

        const res_items = [];
        for (let dt of dt_list) {
            res_items.push(res_item_objects[dt]);
        }
        if (res_items.length < size) {
            res_index = -1;
        }
        return BaseRes.success(res, {index: res_index, items: res_items});
    });
};

module.exports = {
    getRaces
};