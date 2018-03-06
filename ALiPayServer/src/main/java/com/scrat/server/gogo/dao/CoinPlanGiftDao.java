package com.scrat.server.gogo.dao;

import com.scrat.server.gogo.base.BaseDao;
import com.scrat.server.gogo.base.BaseRowObj;
import org.springframework.stereotype.Repository;

/**
 * Created by scrat on 2018/3/6.
 */
@Repository
public class CoinPlanGiftDao extends BaseDao {
    public BaseRowObj getCoinPlanGift(String uid, String coinPlanId) {
        String sql = "select * from coin_plan_gift where uid=? and coin_plan_id=? limit 1";
        return queryForMap(sql, uid, coinPlanId);
    }

    public void updateTotalGift(String uid, String coinPlanId, int totalGift) {
        String sql = "update coin_plan_gift set total_gift=? where uid=? and coin_plan_id=?";
        update(sql, totalGift, uid, coinPlanId);
    }

    public void addTotalGift(String uid, String coinPlanId, int totalGift) {
        long now = System.currentTimeMillis();
        String sql = "insert ignore into coin_plan_gift set uid=?, coin_plan_id=?, total_gift=?, create_ts=?";
        update(sql, uid, coinPlanId, totalGift, now);
    }
}
