package com.scrat.server.gogo.base;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.util.Map;

/**
 * Created by scrat on 2017/11/6.
 */
@Repository
public abstract class BaseDao {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    protected BaseRowObj queryForMap(String sql, Object... objects) {
        try {
            Map<String, Object> res = jdbcTemplate.queryForMap(sql, objects);
            return new BaseRowObj(res);
        } catch (EmptyResultDataAccessException e) {
            return BaseRowObj.EMPTY;
        }
    }

    protected long queryForLong(String sql, Object... objects) {
        try {
            return jdbcTemplate.queryForObject(sql, objects, Long.class);
        } catch (Exception e) {
            e.printStackTrace();
            return 0L;
        }
    }

    protected long insert(String sql, String autoIncrement, Object... objects) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement(sql, new String[]{autoIncrement});
            int i = 1;
            for (Object obj : objects) {
                ps.setObject(i, obj);
                i++;
            }
            return ps;
        }, keyHolder);
        Number id = keyHolder.getKey();
        if (id == null) {
            return -1L;
        }
        return id.longValue();
    }

    protected int update(String sql, Object... objects) {
        return jdbcTemplate.update(sql, objects);
    }
}
