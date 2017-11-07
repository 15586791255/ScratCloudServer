package com.scrat.server.gogo.dao;

import com.scrat.server.gogo.base.BaseDao;
import org.springframework.stereotype.Repository;

import java.util.Date;

/**
 * Created by scrat on 2017/11/7.
 */
@Repository
public class CoinHistoryDao extends BaseDao {
    public static final String TYPE_BUG_COIN = "buy_coin";

    public void addCoinHistory(String uid, int count, String type, String typeId) {
        long nowTs = new Date().getTime();
        String sql = "insert ignore into coin_history set uid=?,coin_count=?,tp=?,tp_id=?,create_ts=?";
        update(sql, uid, count, type, typeId, nowTs);
    }
}
