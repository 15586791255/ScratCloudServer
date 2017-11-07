package com.scrat.server.gogo.dao;

import com.scrat.server.gogo.base.BaseDao;
import com.scrat.server.gogo.base.BaseRowObj;
import org.springframework.stereotype.Repository;

/**
 * Created by scrat on 2017/11/7.
 */
@Repository
public class OrderDao extends BaseDao {
    public static final String PLATFORM_ALIPAY = "alipay";
    public static final String STATUS_PAID = "paid";

    public long addOrder(String uid, String outTradeNo, String type, String typeId, long fee, String payPlatform, long createTs) {
        String sql = "insert ignore into order_info set uid=?,out_trade_no=?,tp=?,tp_id=?,fee=?,pay_pt=?,create_ts=?";

        return insert(sql, "order_id", uid, outTradeNo, type, typeId, fee, payPlatform, createTs);
    }

    public BaseRowObj getOrder(String orderId) {
        String sql = "select * from order_info where order_id=?";

        return queryForMap(sql, orderId);
    }

    public void updateOrder(String orderId, String status) {
        String sql = "update order_info set status=? where order_id=?";

        update(sql, status, orderId);
    }
}
