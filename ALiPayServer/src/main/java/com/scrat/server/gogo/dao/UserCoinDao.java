package com.scrat.server.gogo.dao;

import com.scrat.server.gogo.base.BaseDao;
import com.scrat.server.gogo.base.BaseRowObj;
import org.springframework.stereotype.Repository;

import java.util.Date;

/**
 * Created by scrat on 2017/11/7.
 */
@Repository
public class UserCoinDao extends BaseDao {
    public BaseRowObj getUserCoin(String uid) {
        String sql = "select * from user_coin where uid=? limit 1";
        return queryForMap(sql, uid);
    }

    public long addUserCoin(String uid, int count) {
        long nowTs = new Date().getTime();
        String sql = "insert ignore into user_coin set uid=?,coin_count=?,create_ts=?";
        return insert(sql, "user_coin_id", uid, count, nowTs);
    }

    public void updateUserCoin(String uid, int count) {
        long nowTs = new Date().getTime();
        String sql = "update user_coin set coin_count=?,update_ts=? where uid=?";
        update(sql, count, nowTs, uid);
    }
}
