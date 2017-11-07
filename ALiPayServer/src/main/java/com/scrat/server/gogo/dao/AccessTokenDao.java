package com.scrat.server.gogo.dao;

import com.scrat.server.gogo.base.BaseDao;
import com.scrat.server.gogo.base.BaseRowObj;
import org.springframework.stereotype.Repository;

/**
 * Created by scrat on 2017/11/6.
 */
@Repository
public class AccessTokenDao extends BaseDao {

    public BaseRowObj getToken(String uid, String token) {
        String sql = "select * from access_token where uid=? and token=? limit 1";
        return queryForMap(sql, uid, token);
    }
}
