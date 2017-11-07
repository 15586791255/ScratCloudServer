package com.scrat.server.gogo.dao;

import com.scrat.server.gogo.base.BaseDao;
import com.scrat.server.gogo.base.BaseRowObj;
import org.springframework.stereotype.Repository;

/**
 * Created by scrat on 2017/11/6.
 */
@Repository
public class CoinPlanDao extends BaseDao {
    public BaseRowObj getCoinPlan(String coinPlanId) {
        String sql = "select * from coin_plan where coin_plan_id=?";
        return queryForMap(sql, coinPlanId);
    }
}
