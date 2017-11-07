package com.scrat.server.gogo;

import com.alipay.api.AlipayApiException;
import com.alipay.api.AlipayClient;
import com.alipay.api.DefaultAlipayClient;
import com.alipay.api.domain.AlipayTradeAppPayModel;
import com.alipay.api.internal.util.AlipaySignature;
import com.alipay.api.request.AlipayTradeAppPayRequest;
import com.alipay.api.response.AlipayTradeAppPayResponse;
import com.scrat.server.gogo.base.BaseController;
import com.scrat.server.gogo.base.BaseRowObj;
import com.scrat.server.gogo.dao.AccessTokenDao;
import com.scrat.server.gogo.dao.CoinPlanDao;
import com.scrat.server.gogo.dao.OrderDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by scrat on 2017/11/6.
 */
@RestController
@RequestMapping("/alipay")
public class PayController extends BaseController {

    @Value("${alipay.app-id}")
    private String appId;
    @Value("${alipay.app-private-key}")
    private String appPrivateKey;
    @Value("${alipay.app-public-key}")
    private String appPublicKey;
    @Value("${alipay.notify-url}")
    private String notifyUrl;
    @Value("${alipay.timeout}")
    private String timeout;
    @Value("${pay.debug}")
    private boolean debug;

    @Autowired
    private AccessTokenDao accessTokenDao;
    @Autowired
    private CoinPlanDao coinPlanDao;
    @Autowired
    private OrderDao orderDao;

//    curl -X POST -H 'Content-type: application/json' -H 'uid:27008002' -H 'access_token: rT843UYr4mhneBqW'  http://localhost:8080/alipay/order/coin_plan/1
    @RequestMapping(value = "/order/coin_plan/{coinPlanId}", method = RequestMethod.POST)
    public Map<String, Object> bugCoin(@RequestHeader String uid,
                                       @RequestHeader(value = "access_token") String accessToken,
                                       @PathVariable String coinPlanId) {
//        BaseRowObj params = new BaseRowObj(paramObj);
//        if (params.isEmpty()) {
//            return res().code(400).msg("参数异常").build();
//        }

        BaseRowObj tokenInfo = accessTokenDao.getToken(uid, accessToken);
        if (tokenInfo.isEmpty()) {
            return res().code(498).msg("请重新登录").build();
        }

        long nowTs = new Date().getTime();
        if (tokenInfo.optLong("expired_ts") < nowTs) {
            return res().code(498).msg("请重新登录").build();
        }

        BaseRowObj planInfo = coinPlanDao.getCoinPlan(coinPlanId);
        if (planInfo.isEmpty()) {
            return res().code(404).msg("没有找到相应数据").build();
        }

        long fee = debug ? 1L : planInfo.opt("fee", 0L);
        String outTradNo = createOutTradeNo(nowTs, coinPlanId);
        long orderId = orderDao.addOrder(uid, outTradNo, "coin_plan", coinPlanId, fee, OrderDao.PLATFORM_ALIPAY, nowTs);
        if (orderId < 0L) {
            return res().code(500).msg("创建订单失败").build();
        }

        String alipayOrderInfo = createALiPayOrderInfo(orderId, outTradNo, fee, createSubject(planInfo));
        if (alipayOrderInfo == null) {
            return res().code(500).msg("创建支付宝订单失败").build();
        }
        System.out.println(orderId);
        System.out.println(alipayOrderInfo);

        return res().data(map().put("order", alipayOrderInfo).build()).build();
    }

    private String createSubject(BaseRowObj planInfo) {
        return planInfo.optString("coin_count") + "竞猜币";
    }

    private int getRandomInt(int min, int max) {
        return (int) (Math.random() * (max - min + 1)) + min;
    }

    private String createOutTradeNo(long ts, String planId) {
        return String.format("%s%s%s", ts, getRandomInt(100, 999), planId);
    }

    private String formatFee(long fee) {
        return String.format("%.2f", fee / 100f);
    }

    private String createALiPayOrderInfo(long orderId, String outTradeNo, long fee, String subject) {
        AlipayClient alipayClient = new DefaultAlipayClient(
                "https://openapi.alipay.com/gateway.do",
                appId,
                appPrivateKey,
                "json",
                "utf-8",
                appPublicKey,
                "RSA2");

        AlipayTradeAppPayRequest request = new AlipayTradeAppPayRequest();
        AlipayTradeAppPayModel model = new AlipayTradeAppPayModel();
        model.setBody("GoGo电竞");
        model.setSubject(subject);
        model.setOutTradeNo(outTradeNo);
        model.setTimeoutExpress(timeout);
        model.setTotalAmount(formatFee(fee));
        model.setProductCode("QUICK_MSECURITY_PAY");
        request.setBizModel(model);
        String url = String.format(notifyUrl, orderId);
        request.setNotifyUrl(url);
        try {
            AlipayTradeAppPayResponse response = alipayClient.sdkExecute(request);
            return response.getBody();
        } catch (AlipayApiException e) {
            e.printStackTrace();
            return null;
        }
    }

//    curl -X POST 'http://localhost:8080/alipay/notify/1'
    @RequestMapping(value = "/notify/{orderId}", method = RequestMethod.POST)
    public String notifyALiPay(@PathVariable String orderId, HttpServletRequest request) {
        BaseRowObj orderInfo = orderDao.getOrder(orderId);

        if (orderInfo.isEmpty()) {
            return "fail";
        }

        Map<String, String> params = new HashMap<>();
        Map requestParams = request.getParameterMap();
        for (Object o : requestParams.keySet()) {
            String name = (String) o;
            String[] values = (String[]) requestParams.get(name);
            String valueStr = "";
            for (int i = 0; i < values.length; i++) {
                valueStr = (i == values.length - 1) ? valueStr + values[i] : valueStr + values[i] + ",";
            }
            //valueStr = new String(valueStr.getBytes("ISO-8859-1"), "utf-8");
            params.put(name, valueStr);
        }
        System.out.println(params);
        try {
            boolean flag = AlipaySignature.rsaCheckV1(params, appPublicKey, "utf-8", "RSA2");
            System.out.println(flag);
            if (!flag) {
                return "fail";
            }
            orderDao.updateOrder(orderId, OrderDao.STATUS_PAID);
        } catch (AlipayApiException e) {
            e.printStackTrace();
            return "fail";
        }
        return "success";
    }

    @RequestMapping("/test")
    public String test() {
        return "ok";
    }
}
