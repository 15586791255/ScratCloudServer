const RaceDao = require('../dao/RaceDao');
const TeamDao = require('../dao/TeamDao');
const BettingDao = require('../dao/BettingDao');
const BettingItemDao = require('../dao/BettingItemDao');
const UserBettingDao = require('../dao/UserBettingDao');
const RaceInfoDao = require('../dao/RaceInfoDao');
const UserCoinDao = require('../dao/UserCoinDao');
const CoinHistoryDao = require('../dao/CoinHistoryDao');
const AccessTokenDao = require('../dao/AccessTokenDao');

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
        let res_index;
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
            const [race_info] = yield RaceInfoDao.getRaceInfo(race.race_info_id);
            if (!race_info) {
                continue;
            }
            race.race_name = race_info.race_name;
            formatRace(race);
            item_obj.items.push(race);
            res_item_objects[curr_dt] = item_obj;
        }

        const res_items = [];
        for (let dt of dt_list) {
            if (res_item_objects[dt]) {
                res_items.push(res_item_objects[dt]);
            }
        }
        if (res_items.length < size) {
            res_index = -1;
        }
        return BaseRes.success(res, {index: res_index, items: res_items});
    });
};

const getRacesDetail = (req, res) => {
    const {app_key, pt, uid, access_token} = req.headers;
    const {race_id} = req.params;

    Co(function *() {
        const [race] = yield RaceDao.getRaceDetail(race_id);
        if (!race) {
            return BaseRes.notFoundError(res);
        }

        if (race.delete_ts > 0) {
            return BaseRes.notFoundError(res, '赛事已被删除');
        }

        const [team_a] = yield TeamDao.getTeamByTid(race.team_id_a);
        const [team_b] = yield TeamDao.getTeamByTid(race.team_id_b);
        race.team_a = formatTeam(team_a);
        race.team_b = formatTeam(team_b);
        formatRace(race);

        const [race_info] = yield RaceInfoDao.getRaceInfo(race.race_info_id);
        race.description = race_info.description;
        race.race_name = race_info.race_name;
        race.start_ts = race_info.start_ts;
        race.end_ts = race_info.end_ts;

        const betting_list = yield BettingDao.getBetting(race_id);
        if (betting_list.length == 0) {
            return BaseRes.success(res, {race, betting: []});
        }

        for (let betting of betting_list) {
            delete betting.create_ts;
            delete betting.update_ts;
            delete betting.delete_ts;

            let has_betting = false;
            const betting_items = yield BettingItemDao.getBettingItem(betting.betting_id);
            for (let betting_item of betting_items) {
                delete betting_item.create_ts;
                delete betting_item.update_ts;
                delete betting_item.delete_ts;

                if (!uid) {
                    betting_item.coin = -1;
                    continue;
                }

                const [user_betting] = yield UserBettingDao.getUserBettingCoin(uid, betting_item.betting_item_id);
                if (user_betting.total) {
                    betting_item.coin = parseInt(user_betting.total);
                    has_betting = true;
                } else {
                    betting_item.coin = 0;
                }
            }
            betting.items = betting_items;
            if (!uid) {
                betting.betting_status = 'unknown';
            } else if (has_betting) {
                betting.betting_status = 'already_bet';
            } else {
                betting.betting_status = 'not_bet'
            }
        }

        BaseRes.success(res, {race, betting: betting_list});
    });
};

const getRaceTpDetail = (req, res) => {
    const {race_id, tp} = req.params;
    Co(function *() {
        const betting_list = yield BettingDao.getBettings(race_id, tp);
        if (betting_list.length == 0) {
            return BaseRes.success(res, []);
        }

        for (let betting of betting_list) {
            delete betting.create_ts;
            delete betting.update_ts;
            delete betting.delete_ts;

            const betting_items = yield BettingItemDao.getBettingItem(betting.betting_id);
            for (let betting_item of betting_items) {
                delete betting_item.create_ts;
                delete betting_item.update_ts;
                delete betting_item.delete_ts;
            }
            betting.items = betting_items;
        }
        BaseRes.success(res, betting_list);
    });
};

const getRacesDetail2 = (req, res) => {
    const {race_id} = req.params;

    Co(function *() {
        const [race] = yield RaceDao.getRaceDetail(race_id);
        if (!race) {
            return BaseRes.notFoundError(res);
        }

        if (race.delete_ts > 0) {
            return BaseRes.notFoundError(res, '赛事已被删除');
        }

        const [team_a] = yield TeamDao.getTeamByTid(race.team_id_a);
        const [team_b] = yield TeamDao.getTeamByTid(race.team_id_b);
        race.team_a = formatTeam(team_a);
        race.team_b = formatTeam(team_b);
        formatRace(race);

        const [race_info] = yield RaceInfoDao.getRaceInfo(race.race_info_id);
        race.description = race_info.description;
        race.race_name = race_info.race_name;
        race.start_ts = race_info.start_ts;
        race.end_ts = race_info.end_ts;

        const betting_tps = yield BettingDao.getBettingTps(race_id);
        const betting_tp_list = [];
        for (let tp of betting_tps) {
            if (tp == '') {
                continue;
            }
            let tp_name;
            if (tp == 0) {
                tp_name = '总局';
            } else {
                tp_name = `第${tp}局`;
            }
            betting_tp_list.push({
                tp,
                tp_name
            })
        }

        BaseRes.success(res, {race, betting_tps: betting_tp_list});
    });
};

const createBetting = (req, res) => {
    const {app_key, pt, uid, access_token} = req.headers;
    if (!uid || !access_token) {
        return BaseRes.tokenError(res);
    }
    const {coin, betting_item_id_list} = req.body;

    if (!coin || !betting_item_id_list || betting_item_id_list.length == 0) {
        return BaseRes.paramError(res);
    }

    Co(function *() {
        const [token] = yield AccessTokenDao.getToken(uid, access_token);
        if (!token) {
            return BaseRes.tokenError(res);
        }
        
        const now_ts = new Date().getTime();
        if (token.expired_ts < now_ts) {
            return BaseRes.tokenError(res);
        }

        const [coin_info] = yield UserCoinDao.findByUid(uid);
        if (!coin_info || coin_info.coin_count <= 0 || coin_info.coin_count < coin) {
            return BaseRes.error(res, 998, '投注失败，竞猜币不足');
        }

        const betting_items = yield BettingItemDao.getBettingItems(betting_item_id_list);
        if (betting_items.length < betting_item_id_list.length) {
            return BaseRes.forbiddenError(res, '投注失败，部分竞猜项目已失效');
        }

        const betting_id_set = new Set();
        let odds = 1;
        for (let betting_item of betting_items) {
            betting_id_set.add(betting_item.betting_id);
            odds *= betting_item.odds;
        }

        if (betting_id_set.size < betting_item_id_list.length) {
            return BaseRes.forbiddenError(res, '投注失败，每个竞猜项目只能选一项');
        }
        
        for (let betting_id of betting_id_set) {
            const [betting] = yield BettingDao.getBettingDetail(betting_id);
            if (!betting) {
                return BaseRes.forbiddenError(res, '投注失败，部分竞猜项目已失效');
            }
            const [race] = yield RaceDao.getRaceDetail(betting.race_id);
            if (!race) {
                return BaseRes.forbiddenError(res, '投注失败，赛事失效');
            }
            if (now_ts > (parseFloat(race.race_ts) + 3600000)) {
                return BaseRes.forbiddenError(res, '投注失败，已超出投注时间');
            }
        }

        const user_betting_id = yield UserBettingDao.addUserBetting(uid, betting_item_id_list, coin, odds);
        if (user_betting_id <= 0) {
            return BaseRes.serverError(res, '创建投注订单失效');
        }
        yield UserCoinDao.decreaseCoin(uid, coin);
        yield CoinHistoryDao.addCoinHistory(uid, coin, 'betting', user_betting_id);
        BaseRes.success(res);
    });
};

const getBettingHistories = (req, res) => {
    const {app_key, pt, uid, access_token} = req.headers;
    if (!uid || !access_token) {
        return BaseRes.tokenError(res);
    }
    
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
        const [token] = yield AccessTokenDao.getToken(uid, access_token);
        if (!token) {
            return BaseRes.tokenError(res);
        }

        const now_ts = new Date().getTime();
        if (token.expired_ts < now_ts) {
            return BaseRes.tokenError(res);
        }
        
        const user_bettings = yield UserBettingDao.getUserBetting(uid, index, parseInt(size));
        let min_index = index;
        for (let user_betting of user_bettings) {
            user_betting.betting_item_ids = user_betting.betting_item_ids.split(',');
            const betting_items = yield BettingItemDao.getBettingItems(user_betting.betting_item_ids);
            const bettings = [];
            let race_id;
            for (let betting_item of betting_items) {
                delete betting_item.create_ts;
                delete betting_item.update_ts;
                delete betting_item.delete_ts;
                const [betting] = yield BettingDao.getBettingDetail(betting_item.betting_id);
                delete betting.update_ts;
                delete betting.delete_ts;
                delete betting.create_ts;
                race_id = betting.race_id;
                betting.items = [betting_item];
                bettings.push(betting);
            }
            user_betting.bettings = bettings;
            const [race] = yield RaceDao.getRaceDetail(race_id);
            const [race_info] = yield RaceInfoDao.getRaceInfo(race.race_info_id);
            user_betting.race = {
                race_name: race_info.race_name,
                description: race_info.description
            };
            
            if (min_index == 0 || min_index > user_betting.user_betting_id) {
                min_index = user_betting.user_betting_id;
            }
        }
        if (user_bettings.length < size) {
            min_index = -1;
        }
        BaseRes.success(res, {index: min_index, items: user_bettings});
    });
};

const getNewsTypes = (req, res) => {
    BaseRes.success(res, Config.games);
};

module.exports = {
    getRaces, getRacesDetail, createBetting, getBettingHistories, getRacesDetail2, getRaceTpDetail, getNewsTypes
};