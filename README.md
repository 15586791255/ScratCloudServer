# Config on server

## nginx

添加配置`underscores_in_headers on;`，忽略header中的下划线等限制

```
http {
    ...
    underscores_in_headers on;
    ...
}
```

```
    location /api/core/ {
        proxy_pass http://localhost:8083/core/;
    }
    location /api/file/ {
        proxy_pass http://localhost:8084/file/;
    }
    location /api/account/ {
        proxy_pass http://localhost:8082/account/;
    }
    location /api/pay/alipay/ {
        proxy_pass http://localhost:8085/alipay/;
    }
    location /api/pay/weixin/ {
        proxy_pass http://localhost:8087/weixin/;
    }
    location /api/mall/ {
        proxy_pass http://localhost:8086/mall/;
    }
    location /api/feedback/ {
        proxy_pass http://localhost:8088/feedback/;
    }
    location /cms/ {
        proxy_pass http://localhost:8089/;
    }
```

# Server API for Gogo

全局Header

| param | type | require | description |
| --- | :---: | :---: | --- |
| pt | string | true | 平台，`iOS`和`Android`请填app |
| app_key | string | true | 由服务端提供 |
| uid | string | true | 如果已经登录，请带上登录的时候返回的uid |
| access_token | string | true | 如果已经登录，请带上登录的时候返回的access_token |

## 获取Banner

### API

[GET] `/core/banner`

### Response

```
curl 'http://localhost:8083/core/banner'
```

Res

```
{
    "code": 200,
    "msg": "ok",
    "data": [
        {
            "news_id": 6,
            "nid": 330708,
            "title": "【KPL秋季赛】第6周 WeFun vs AG超玩会_1",
            "tp": "KPL",
            "news_ts": "1509173893000",
            "view_count": 0,
            "cover": "https://itea-cdn.qq.com/file/tgl/20171027/0.1509036733.2056077a00b5e89d0eb6793b06773159.230*140_71784.png"
        },
        {
            "news_id": 5,
            "nid": 330704,
            "title": "【KPL秋季赛】第6周 WeFun vs AG超玩会_2",
            "tp": "KPL",
            "news_ts": "1509173922000",
            "view_count": 0,
            "cover": "https://itea-cdn.qq.com/file/tgl/20171027/10.1509036412.2d77cdb8b7fef3184c4d67d21215d051.230*140_83683.png"
        },
        {
            "news_id": 4,
            "nid": 330718,
            "title": "【KPL秋季赛】第6周 WeFun vs AG超玩会赛后复盘",
            "tp": "KPL",
            "news_ts": "1509173966000",
            "view_count": 0,
            "cover": "https://itea-cdn.qq.com/file/tgl/20171027/12.1509037631.656fa232f3ae78423783962805526e62.230*140_69956.png"
        },
        {
            "news_id": 3,
            "nid": 330906,
            "title": "王者荣耀周年庆：比赛·一路同行",
            "tp": "综合（for 赛事中心运营人员）",
            "news_ts": "1509073902000",
            "view_count": 2474,
            "cover": "https://itea-cdn.qq.com/file/tgl/20171027/360x203.1509073051.5ce76b3377e9d15d8ede0bee243a6857.360*203_27511.jpg"
        },
        {
            "news_id": 2,
            "nid": 331955,
            "title": "KPL日报：QGhappy九连胜锁定季后赛名额，XQ击败YTG闯进小组前四",
            "tp": "综合（for 赛事中心运营人员）",
            "news_ts": "1509161291000",
            "view_count": 1342,
            "cover": "https://itea-cdn.qq.com/file/tgl/20171028/360x20336.1509161157.9cebfcedc16b28ee8286f82726bdc9f9.360*203_61968.jpg"
        }
    ]
}
```

# 发送短信

[POST] **application/json** `/account/sms`

### Param

| param | type | require | description |
| --- | :---: | :---: | --- |
| tel | string | true | 11位有效的电话号码 |

### Response

> 正常返回

```
curl -X POST -H "Content-type: application/json" -d '{"tel":"15018329815"}' 'http://localhost:8082/account/sms'
```

Res

```
{"code":200,"msg":"ok"}
```

> 发送失败

```
curl -X POST -H "Content-type: application/json" -d '{"tel":"150183298151"}' 'http://localhost:8082/account/sms'
```

Res

```
{
    "code": 500,
    "msg": "手机号格式错误",
    "data": {
        "result": "1016",
        "errmsg": "手机号格式错误",
        "ext": ""
    }
}
```

# 短信登录

[POST] **application/json** `/account/sms_login`

### Param

| param | type | require | description |
| --- | :---: | :---: | --- |
| tel | string | true | 11位有效的电话号码 |
| code | string | true | 验证码 |

### Response

> 成功返回

```
curl -X POST -H "Content-type: application/json" -d '{"tel":"15018329815", "code": "528941"}' 'http://localhost:8082/account/sms_login'
```

Res

```
{
    "code": 200,
    "msg": "ok",
    "data": {
        "uid": "96008684",
        "refresh_token": "bGDep7WTLCIqjlTw",
        "access_token": "hh22evUs0RWTBqJ7",
        "expired_in": 86400000
    }
}
```

> 验证码实效

Res

```
{"code":403,"msg":"验证码已过期"}
```

> 验证码不存在

```
curl -X POST -H "Content-type: application/json" -d '{"tel":"15018329815", "code": "not_found_code"}' 'http://localhost:8082/account/sms_login'
```

Res

```
{"code":404,"msg":"验证码不存在"}
```


## 刷新access_token

[POST] **application/json** `/account/token`

### Param

| param | type | require | description |
| --- | :---: | :---: | --- |
| refresh_token | string | true | 刷新令牌 |

### Response

> 正常返回

```
curl -X POST -H "Content-type: application/json" -H "app_key: test_key" -H "pt: app" -H "uid: 96008684" -d '{"refresh_token": "bGDep7WTLCIqjlTw"}' 'http://localhost:8082/account/token'
```

Res

```
{
    "code": 200,
    "msg": "ok",
    "data": {
        "uid": "96008684",
        "refresh_token": "bGDep7WTLCIqjlTw",
        "access_token": "jRC3wJ06s0ufTDch",
        "expired_in": 86400000
    }
}
```

> 用户uid不存在或者refresh_token找不到

```
curl -X POST -H "Content-type: application/json" -H "app_key: test_key" -H "pt: app" -H "uid: 960086845" -d '{"refresh_token": "bGDep7WTLCIqjlTw"}' 'http://localhost:8082/account/token'
```

Res

```
{"code":404,"msg":"登录信息异常"}
```

> 登录超时

```
curl -X POST -H "Content-type: application/json" -H "app_key: test_key" -H "pt: app" -H "uid: 96008684" -d '{"refresh_token": "huuWBBCRC2sO1dMk"}' 'http://localhost:8082/account/token'
```

Res

```
{"code":403,"msg":"登录超时"}
```

## 获取七牛的上传凭证

[GET] `/file/qiniu_token`

### Response

> 正常返回

```
curl 'http://localhost:8084/file/qiniu_token'
```

Res

```
{
    "code": 200,
    "msg": "ok",
    "data": {
        "upload_token": "pFMOp8Bx9bbuV7TxOLzq7srre69t2-KiT4qs_ia0:7HpRm7xvKEnSth0Qbz3WJq3SgIQ=:eyJzY29wZSI6InRpbnN0b25lIiwiZGVhZGxpbmUiOjE1MDkyMTY5NjZ9",
        "domain": "https://oiu0cclvb.qnssl.com/"
    }
}
```

## 添加评论

[POST] **application/json** `/core/comment`

### Param

| param | type | require | description |
| --- | :---: | :---: | --- |
| tp | string | true | 类型，首页列表的评论填 news ; 赛事评论填 race |
| target_id | string | true | 如果是首页列表评论，对应的是news_id, 如果是赛事的评论，对应的是race_id |
| content | string | true | 评论内容 |

### Response

> 正常返回

```
curl -X POST -H "Content-type: application/json" -H "app_key: test_key" -H "pt: app" -H "uid: 96008684" -H "access_token: 77nslIFtnXlgfzDe" -d '{"tp": "news", "target_id": 1, "content": "测试评论"}' 'http://localhost:8083/core/comment'
```

Res

```
{
    "code": 200,
    "msg": "ok",
    "data": {
        "comment_id": 1,
        "uid": "96008684",
        "tp": "news",
        "target_id": 1,
        "content": "测试评论",
        "create_ts": "1509263142027"
    }
}
```

> 需要重新登录

```
{"code":498,"msg":"请重新登录"}
```

## 获取战队列表

[GET] `/core/teams`

### Response

> 正常返回

```
curl 'http://localhost:8083/core/teams?index=0&size=20'
```

Res

```
{
    "code": 200,
    "msg": "ok",
    "data": {
        "index": -1,
        "items": [
            {
                "team_id": 12,
                "team_name": "GK",
                "short_name": "GK",
                "logo": "http://ossweb-img.qq.com/htdocs/weiguanwang/smoba/php3Vk6UO_1057408997_1504853231.png",
                "create_ts": "1509302181810"
            },
            {
                "team_id": 11,
                "team_name": "RNG.M",
                "short_name": "RNG.M",
                "logo": "http://ossweb-img.qq.com/htdocs/weiguanwang/smoba/phpE0o8R8_1073428518_1505269754.png",
                "create_ts": "1509302181808"
            },
            {
                "team_id": 10,
                "team_name": "EDG.M",
                "short_name": "EDG.M",
                "logo": "http://ossweb-img.qq.com/htdocs/weiguanwang/smoba/phpmiq3GP_1104041337_1504853078.png",
                "create_ts": "1509302181807"
            },
            {
                "team_id": 9,
                "team_name": "sViper",
                "short_name": "sViper",
                "logo": "http://ossweb-img.qq.com/htdocs/weiguanwang/smoba/phps09l4L_852880468_1504853493.png",
                "create_ts": "1509302181805"
            },
            {
                "team_id": 8,
                "team_name": "AS仙阁",
                "short_name": "AS仙阁",
                "logo": "http://ossweb-img.qq.com/htdocs/weiguanwang/smoba/phpXFeqVI_915848246_1504852999.png",
                "create_ts": "1509302181802"
            },
            {
                "team_id": 7,
                "team_name": "YTG",
                "short_name": "YTG",
                "logo": "http://ossweb-img.qq.com/htdocs/weiguanwang/smoba/phpajPuFN_253173967_1489139306.png",
                "create_ts": "1509302181800"
            },
            {
                "team_id": 6,
                "team_name": "JC",
                "short_name": "JC",
                "logo": "http://ossweb-img.qq.com/htdocs/weiguanwang/smoba/phppSw69l_1928455556_1489140572.png",
                "create_ts": "1509302181798"
            },
            {
                "team_id": 5,
                "team_name": "XQ",
                "short_name": "X-QUEST",
                "logo": "http://ossweb-img.qq.com/htdocs/weiguanwang/smoba/phpAsQ8en_55863151_1504853133.png",
                "create_ts": "1509302181797"
            },
            {
                "team_id": 4,
                "team_name": "WF",
                "short_name": "WF",
                "logo": "http://ossweb-img.qq.com/htdocs/weiguanwang/smoba/php8FoNtq_1043328301_1489139259.png",
                "create_ts": "1509302181796"
            },
            {
                "team_id": 3,
                "team_name": "eStarPro",
                "short_name": "eStarPro",
                "logo": "http://ossweb-img.qq.com/htdocs/weiguanwang/smoba/phpufmVkV_73983205_1505115440.png",
                "create_ts": "1509302181794"
            },
            {
                "team_id": 2,
                "team_name": "AG超玩会",
                "short_name": "AG",
                "logo": "http://ossweb-img.qq.com/htdocs/weiguanwang/smoba/php2gzntz_468365754_1489057020.png",
                "create_ts": "1509302181793"
            },
            {
                "team_id": 1,
                "team_name": "QGhappy",
                "short_name": "QG",
                "logo": "http://ossweb-img.qq.com/htdocs/weiguanwang/smoba/phpsTEvZs_877137796_1489139248.png",
                "create_ts": "1509302181789"
            }
        ]
    }
}
```

## 获取战队详情接口

[GET] `/core/team/:team_id`

### Param

| param | type | require | description |
| --- | :---: | :---: | --- |
| team_id | string | true | 战队ID，属于URL参数 |

### Response

> 正常返回

```
curl 'http://localhost:8083/core/team/1'
```

Res

```
{
    "code": 200,
    "msg": "ok",
    "data": {
        "team": {
            "team_id": 1,
            "team_name": "QGhappy",
            "short_name": "QG",
            "description": "QG电子竞技俱乐部成立于2015年，QGhappy暨QG王者荣耀分部成立于2017年2月8号。QGhappy以“生而无畏，战至终章”敢于拼搏的精神一路走到今天，在2017KPL王者荣耀职业联赛春季赛常规赛中获得15连胜，并获得了2017KPL王者荣耀职业联赛春季赛中总冠军。",
            "logo": "http://ossweb-img.qq.com/htdocs/weiguanwang/smoba/phpsTEvZs_877137796_1489139248.png",
            "create_ts": "1509302181789"
        },
        "members": [
            {
                "member_id": 1,
                "team_id": 1,
                "member_name": "QGhappy.Fly",
                "avatar": "http://ossweb-img.qq.com/htdocs/weiguanwang/smoba/phplCYLmo_1120950802_1489118749.png",
                "description": "边路位置，打法稳健，擅长带线与支援。",
                "create_ts": "1509342423373"
            },
            {
                "member_id": 2,
                "team_id": 1,
                "member_name": "QGhappy.Cat",
                "avatar": "http://ossweb-img.qq.com/htdocs/weiguanwang/smoba/php7yqNXp_1740244572_1489119367.png",
                "description": "中路位置，沉稳冷静，发育和生存能力极强。",
                "create_ts": "1509342423375"
            },
            {
                "member_id": 3,
                "team_id": 1,
                "member_name": "QGhappy.Mc",
                "avatar": "http://ossweb-img.qq.com/htdocs/weiguanwang/smoba/phpWEtsEe_1249381964_1489119368.png",
                "description": "队长，边路位置，经验丰富，大局观全面。",
                "create_ts": "1509342423376"
            },
            {
                "member_id": 4,
                "team_id": 1,
                "member_name": "QGhappy.Alan",
                "avatar": "http://ossweb-img.qq.com/htdocs/weiguanwang/smoba/phpd5HrWB_753583155_1489118748.png",
                "description": "打野位置，是节奏发起者，野区掌控能力强。",
                "create_ts": "1509342423377"
            },
            {
                "member_id": 5,
                "team_id": 1,
                "member_name": "QGhappy.XX",
                "avatar": "http://ossweb-img.qq.com/htdocs/weiguanwang/smoba/phpKhCbPb_1615808906_1489119368.png",
                "description": "中单位置，对线凶狠强势，擅长压制对手。",
                "create_ts": "1509342423378"
            },
            {
                "member_id": 6,
                "team_id": 1,
                "member_name": "QGhappy.Hurt",
                "avatar": "http://ossweb-img.qq.com/htdocs/weiguanwang/smoba/phpFjfZzM_238453227_1489118749.png",
                "description": "边路位置，个人实力深厚，十分稳重。",
                "create_ts": "1509342423379"
            },
            {
                "member_id": 7,
                "team_id": 1,
                "member_name": "QGhappy.YANG",
                "avatar": "http://ossweb-img.qq.com/htdocs/weiguanwang/smoba/phpmBjWZ8_1016405817_1489119368.png",
                "description": "游走位置，队内多面手，是队伍节奏的催化剂。",
                "create_ts": "1509342423380"
            },
            {
                "member_id": 8,
                "team_id": 1,
                "member_name": "QGhappy.Gemini（教练）",
                "avatar": "http://ossweb-img.qq.com/htdocs/weiguanwang/smoba/phpepJkJd_186034865_1489118748.png",
                "description": "前风暴英雄职业选手。",
                "create_ts": "1509342423381"
            }
        ]
    }
}
```

## 微信登录

[POST] **application/json** `/account/wx_login`

### Param

| param | type | require | description |
| --- | :---: | :---: | --- |
| code | string | true | 微信授权成功后返回给客户端的code |

> 正常放回

```
curl -X POST -H "Content-type: application/json" -H "app_key: test_key" -H "pt: app" -d '{"code": "081oOcKc2zWE7C0QdAJc2YZ8Kc2oOcKy"}' 'http://localhost:8082/account/wx_login'
```

Res

```
{
    "code": 200,
    "msg": "ok",
    "data": {
        "uid": "27008002",
        "refresh_token": "9ZqVdPgDolxh5xER",
        "access_token": "rT843UYr4mhneBqW",
        "expired_in": 86400000
    }
}
```

## 生成支付宝订单

[POST] **application/json** `/pay/alipay/order/coin_plan/:id`

### Param

| param | type | require | description |
| --- | :---: | :---: | --- |
| id | string | true | coin_plan_id, URL参数 |

### Response

```
{"code":200,"msg":"ok","data":"支付宝的orderInfo"}
```

## 退出登录接口

[POST] **application/json** `/account/logout`

### Param

| param | type | require | description |
| --- | :---: | :---: | --- |
| refresh_token | string | true | 刷新令牌 |

### Response

```
curl -X POST -H "Content-type: application/json" -H "app_key: test_key" -H "pt: app" -H "uid: 27008002" -H 'access_token: k9MQOhagzMg3voff' -d '{"refresh_token": "VReffR2dV7klN1xs"}' 'http://localhost:8082/account/logout'
```

Res

```
{"code":200,"msg":"ok"}
```

## 获取商品列表

[GET] `/mall/goods`

### Param

| param | type | require | description |
| --- | :---: | :---: | --- |
| index | int | false | 标识，首次传0, 之后根据上一次返回的index传过来即可, index=-1代表没有更多数据 |
| size | int | false | 返回数量，默认20, size>0 && size<=60 |
| tp | string | true | `equipment`装备; `lucky_money`红包; `game_around`游戏周边; `virtual`虚拟物品 |

### Response

```
curl 'http://localhost:8086/mall/goods?tp=equipment&index=0&size=1'
```

Res

```
{
    "code": 200,
    "msg": "ok",
    "data": {
        "index": -1,
        "items": [
            {
                "goods_id": 1,
                "tp": "equipment",
                "cover": "http://game.gtimg.cn/images/yxzj/web201605/page/pf_img1.png",
                "title": "专属皮肤",
                "coin": 1000,
                "total": 100,
                "max_per_buy": 1,
                "expired_ts": "1510230946000",
                "create_ts": "1510130946000"
            }
        ]
    }
}
```


## 获取商品详情

[GET] `/mall/goods/:goods_id`

### Param

| param | type | require | description |
| --- | :---: | :---: | --- |
| goods_id | string | true | 商品ID，属于URL参数 |

### Response

```
curl 'http://localhost:8086/mall/goods/1'
```

Res

> 注意:
> total_buy=-1 代表用户未登录，不知道是否购买过
> total_buy>-1 代表用户兑换的次数，可根据此判断是否购买
> max_per_buy 每人最多购买次数
> total_apply 代表整个商品已经兑换的次数
> total 总共兑换次数

```
{
    "code": 200,
    "msg": "ok",
    "data": {
        "goods_id": 1,
        "tp": "equipment",
        "cover": "http://game.gtimg.cn/images/yxzj/web201605/page/pf_img1.png",
        "title": "专属皮肤",
        "description": "兑换阿珂专属皮肤",
        "coin": 1000,
        "total": 100,
        "max_per_buy": 1,
        "expired_ts": "1510235312000",
        "create_ts": "1510135312000",
        "total_apply": "0",
        "total_buy": -1
    }
}
```


## 兑换商品

[POST] **application/json** `/mall/exchange/:goods_id`

### Param

| param | type | require | description |
| --- | :---: | :---: | --- |
| goods_id | string | true | 商品ID，属于URL参数 |

### Response

```
curl -X POST -H "Content-type: application/json" -H 'uid: 27008002' -H 'access_token: rT843UYr4mhneBqW' 'http://localhost:8086/mall/exchange/1'
```

Res

```
{"code":200,"msg":"ok"}
```

## 获取兑换历史

[GET] `/mall/exchange/history`

### Param

| param | type | require | description |
| --- | :---: | :---: | --- |
| index | int | false | 标识，首次传0, 之后根据上一次返回的index传过来即可, index=-1代表没有更多数据 |
| size | int | false | 返回数量，默认20, size>0 && size<=60 |

### Response

```
curl -H 'uid: 27008002' -H 'access_token: rT843UYr4mhneBqW' 'http://localhost:8086/mall/exchange/history?index=0&size=1'
```

Res

> 注意：status=apply 处理中；status=done 已完成

```
{
    "code": 200,
    "msg": "ok",
    "data": {
        "index": -1,
        "items": [
            {
                "goods_order": {
                    "goods_order_id": 1,
                    "goods_id": 1,
                    "uid": "27008002",
                    "status": "apply",
                    "create_ts": "1510152068067"
                },
                "goods": {
                    "goods_id": 1,
                    "title": "专属皮肤",
                    "coin": 1000
                }
            }
        ]
    }
}
```

## QQ登录

[POST] **application/json** `/account/qq_login`

### Param

| param | type | require | description |
| --- | :---: | :---: | --- |
| openid | string | true | QQ返回的openid |
| access_token | string | true | QQ返回的access_token |

### Response

```
curl -X POST -H 'pt: app' -H 'app_key:test_key' -H "Content-type: application/json" -d '{"openid":"openid","access_token":"access"}' http://localhost:8082/account/qq_login
```

Res

```
{
    "code": 200,
    "msg": "ok",
    "data": {
        "uid": "27008002",
        "refresh_token": "9ZqVdPgDolxh5xER",
        "access_token": "rT843UYr4mhneBqW",
        "expired_in": 86400000
    }
}
```

## 更新用户信息

[POST] **application/json** `/core/user`

### Param

| param | type | require | description |
| --- | :---: | :---: | --- |
| username | string | true | 昵称 |
| avatar | string | true | 头像地址 |
| gender | string | true | 性别。male: 男； female：女； unknown： 未知 |

### Response

```
curl -X POST -H 'uid: 27008002' -H 'access_token: rT843UYr4mhneBqW' -H 'pt: app' -H 'app_key:test_key' -H "Content-type: application/json" -d '{"username": "hh", "gender": "female", "avatar":"http://wx.qlogo.cn/mmopen/vi_32/9icoOxiatBlS91mriaJWBvCGHEsw1N8XibwJPNLAQdyYHic7bdqUG4TqbIDX58KmP7InBWdHPU8tEQU0WdgH8tGmB5A/0"}' 'http://localhost:8083/core/user'
```

Res

```
{"code":200,"msg":"ok"}
```

## 更新地址信息

[POST] **application/json** `/core/address`

### Param

| param | type | require | description |
| --- | :---: | :---: | --- |
| receiver | string | true | 收件人 |
| tel | string | true | 联系电话 |
| location | string | true | 地区 |
| address_detail | string | true | 地址详情 |

### Response

```
curl -X POST -H 'uid: 27008002' -H 'access_token: rT843UYr4mhneBqW' -H 'pt: app' -H 'app_key:test_key' -H "Content-type: application/json" -d '{"receiver": "r", "tel":"t", "location":"l", "address_detail": "a"}' 'http://localhost:8083/core/address'
```

Res

```
{"code":200,"msg":"ok"}
```

## 获取地址信息

[GET] `/core/address`

### Response

```
curl -H 'uid: 27008002' -H 'access_token: rT843UYr4mhneBqW' -H 'pt: app' -H 'app_key:test_key' 'http://localhost:8083/core/address'
```

Res

```
{
    "code": 200,
    "msg": "ok",
    "data": {
        "address_id": 1,
        "uid": "27008002",
        "tel": "t",
        "receiver": "r",
        "location": "l",
        "address_detail": "a"
    }
}
```

## 获取竞猜详情

[GET] `/core/race/:race_id`

### Param

| param | type | require | description |
| --- | :---: | :---: | --- |
| race_id | string | true | 赛事ID |

### Response

```
curl -H 'uid:27008002' http://localhost:8083/core/race/408
```

Res

> 注意  betting_status=already_bet 已投注； betting_status=not_bet 未投注； betting_status=unknown 未知（没登录的情况会这样）

```
{
    "code": 200,
    "msg": "ok",
    "data": {
        "race": {
            "race_id": 306,
            "race_info_id": 6,
            "game_id": 1,
            "score_a": "0",
            "score_b": "0",
            "race_ts": "1510491600000",
            "create_ts": "1509357587635",
            "status": "ready",
            "team_a": {
                "team_id": 10,
                "team_name": "EDG.M",
                "short_name": "EDG.M",
                "logo": "http://ossweb-img.qq.com/htdocs/weiguanwang/smoba/phpmiq3GP_1104041337_1504853078.png",
                "create_ts": "1509302181807"
            },
            "team_b": {
                "team_id": 1,
                "team_name": "QGhappy",
                "short_name": "QG",
                "logo": "http://ossweb-img.qq.com/htdocs/weiguanwang/smoba/phpsTEvZs_877137796_1489139248.png",
                "create_ts": "1509302181789"
            },
            "description": "",
            "race_name": "2017秋季赛·常规赛",
            "start_ts": "1505988000000",
            "end_ts": "1510491600000"
        },
        "betting": [
            {
                "betting_id": 1,
                "title": "你觉得哪一队会赢？",
                "race_id": 306,
                "expired_ts": "1510340314000",
                "items": [
                    {
                        "betting_item_id": 1,
                        "betting_id": 1,
                        "title": "AG超会玩",
                        "odds": 1.2,
                        "coin": 500
                    },
                    {
                        "betting_item_id": 2,
                        "betting_id": 1,
                        "title": "GK",
                        "odds": 2.1,
                        "coin": 0
                    }
                ],
                "betting_status": "already_bet"
            }
        ]
    }
}
```

## 获取竞猜历史

[GET] `/core/betting`

### Param

| param | type | require | description |
| --- | :---: | :---: | --- |
| index | int | false | 标识，首次传0, 之后根据上一次返回的index传过来即可, index=-1代表没有更多数据 |
| size | int | false | 返回数量，默认20, size>0 && size<=60 |

### Response

```
curl -H 'uid:27008002' 'http://localhost:8083/core/betting?index=0&size=2'
```

Res

> 注意  status=apply未完成  status=win赢了  status=lose输了  status=invalid被取消了

```
{
    "code": 200,
    "msg": "ok",
    "data": {
        "index": 2,
        "items": [
            {
                "user_betting_id": 3,
                "uid": "27008002",
                "betting_item_ids": [
                    "1"
                ],
                "coin": 500,
                "odds": 1.2,
                "status": "apply",
                "create_ts": "1510381416625",
                "bettings": [
                    {
                        "betting_id": 1,
                        "title": "全场比赛结果为？",
                        "race_id": 306,
                        "expired_ts": "1510417224000",
                        "items": [
                            {
                                "betting_item_id": 1,
                                "betting_id": 1,
                                "title": "EDG.M 胜",
                                "odds": 1.2
                            }
                        ]
                    }
                ],
                "race": {
                    "race_name": "2017秋季赛·常规赛",
                    "description": ""
                }
            },
            {
                "user_betting_id": 2,
                "uid": "27008002",
                "betting_item_ids": [
                    "1",
                    "3",
                    "5"
                ],
                "coin": 500,
                "odds": 1.60056,
                "status": "apply",
                "create_ts": "1510381402375",
                "bettings": [
                    {
                        "betting_id": 1,
                        "title": "全场比赛结果为？",
                        "race_id": 306,
                        "expired_ts": "1510417224000",
                        "items": [
                            {
                                "betting_item_id": 1,
                                "betting_id": 1,
                                "title": "EDG.M 胜",
                                "odds": 1.2
                            }
                        ]
                    },
                    {
                        "betting_id": 2,
                        "title": "第一局对战结果为？",
                        "race_id": 306,
                        "expired_ts": "1510417224000",
                        "items": [
                            {
                                "betting_item_id": 3,
                                "betting_id": 2,
                                "title": "EDG.M 胜",
                                "odds": 1.14
                            }
                        ]
                    },
                    {
                        "betting_id": 3,
                        "title": "第一局谁先获得一血？",
                        "race_id": 306,
                        "expired_ts": "1510417224000",
                        "items": [
                            {
                                "betting_item_id": 5,
                                "betting_id": 3,
                                "title": "EDG.M",
                                "odds": 1.17
                            }
                        ]
                    }
                ],
                "race": {
                    "race_name": "2017秋季赛·常规赛",
                    "description": ""
                }
            }
        ]
    }
}
```

## 生成微信订单

[POST] **application/json** `/pay/weixin/order/coin_plan/:id`

### Param

| param | type | require | description |
| --- | :---: | :---: | --- |
| id | string | true | coin_plan_id, URL参数 |

### Response

```
{
    "code": 200,
    "msg": "ok",
    "data": {
        "app_id": "wx3349545f4d083130",
        "partner_id": "1491484952",
        "prepay_id": "wx20171113165527fbb4a94e4f0745396937",
        "package": "Sign=WXPay",
        "nonce_str": "sBxvwOYuNpciHklYeUIHlPWCHo7asL6v",
        "timestamp": "1510563327",
        "sign": "CA6DC90290D32B6A9A8C36EE88F7CBCC"
    }
}
```


## 添加反馈

[POST] **application/json** `/feedback/feedback`

### Param

| param | type | require | description |
| --- | :---: | :---: | --- |
| title | string | false | 反馈标题（可不传） |
| content | string | false | 反馈内容（可不传） |
| ver_code | string | false | 版本号（可不传） |
| ver_name | string | false | 版本名（可不传） |
| imgs | string_list | false | 这个是字符串列表，反馈图片（可不传） |

### Response

```
curl -X POST -H 'uid:27008002' -H "Content-type: application/json" -H "app_key:test_key" 'http://localhost:8088/feedback/feedback' -d '{"title":"title","content":"content","ver_code":"1","ver_name":"name","imgs":["http://4493bz.1985t.com/uploads/allimg/160222/5-160222145918.jpg"]}'
```

Res

```
{"code":200,"msg":"ok"}
```

## 获取竞猜项目

[GET] `/core/race2/:race_id/:betting_tp`

### Param

| param | type | require | description |
| --- | :---: | :---: | --- |
| race_id | string | true | 属于URL参数 |
| betting_tp | string | true | 属于URL参数，上面接口返回的betting_tps的tp |

### Response

```
$ curl 'http://localhost:8083/core/race2/422/0'
```

Res

```
{
    "code": 200,
    "msg": "ok",
    "data": [
        {
            "betting_id": 52,
            "title": "最终获胜",
            "race_id": 516,
            "tp": "0",
            "items": [
                {
                    "betting_item_id": 74,
                    "betting_id": 52,
                    "title": "WE",
                    "odds": 1.09,
                    "status": "win"
                },
                {
                    "betting_item_id": 75,
                    "betting_id": 52,
                    "title": "C9",
                    "odds": 9.93,
                    "status": "lose"
                }
            ]
        },
        {
            "betting_id": 53,
            "title": "最终比分",
            "race_id": 516,
            "tp": "0",
            "items": [
                {
                    "betting_item_id": 76,
                    "betting_id": 53,
                    "title": "3 - 0",
                    "odds": 7.64,
                    "status": "lose"
                },
                {
                    "betting_item_id": 77,
                    "betting_id": 53,
                    "title": "3 - 1",
                    "odds": 3.12,
                    "status": "lose"
                },
                {
                    "betting_item_id": 78,
                    "betting_id": 53,
                    "title": "3 - 2",
                    "odds": 2.61,
                    "status": "win"
                },
                {
                    "betting_item_id": 79,
                    "betting_id": 53,
                    "title": "2 - 3",
                    "odds": 6.85,
                    "status": "lose"
                },
                {
                    "betting_item_id": 80,
                    "betting_id": 53,
                    "title": "1 - 3",
                    "odds": 25.77,
                    "status": "lose"
                },
                {
                    "betting_item_id": 81,
                    "betting_id": 53,
                    "title": "0 - 3",
                    "odds": 16.29,
                    "status": "lose"
                }
            ]
        },
        {
            "betting_id": 54,
            "title": "对局总数",
            "race_id": 516,
            "tp": "0",
            "items": [
                {
                    "betting_item_id": 82,
                    "betting_id": 54,
                    "title": "3局",
                    "odds": 4.09,
                    "status": "lose"
                },
                {
                    "betting_item_id": 83,
                    "betting_id": 54,
                    "title": "4局",
                    "odds": 1.8,
                    "status": "lose"
                },
                {
                    "betting_item_id": 84,
                    "betting_id": 54,
                    "title": "5局",
                    "odds": 3.8,
                    "status": "win"
                }
            ]
        }
    ]
}
```

## 获取游戏类型（新闻列表tab）

[GET] `/core/news/type`

### Response

```
curl 'http://localhost:8083/core/news/type'
```

Res

```
{"code":200,"msg":"ok","data":{"wangzhe":"王者荣耀","chicken":"绝地求生"}}
```


## 新闻点赞 20171202

[POST] **application/json** `/core/news/like`

### Param

| param | type | require | description |
| --- | :---: | :---: | --- |
| news_id | string | true | 新闻id |

### Response

```
curl -X POST -H 'uid:27008002' -H "Content-type: application/json" -H "app_key:test_key" -H "access_token:rT843UYr4mhneBqW" 'http://localhost:8083/core/news/like' -d '{"news_id":1}'
```

Res

```
{"code":200,"msg":"ok"}
```

## 评论点赞 20171202

[POST] **application/json** `/core/comment/like`

### Param

| param | type | require | description |
| --- | :---: | :---: | --- |
| comment_id | string | true | 评论id |

### Response

```
curl -X POST -H 'uid:27008002' -H "Content-type: application/json" -H "app_key:test_key" -H "access_token:rT843UYr4mhneBqW" 'http://localhost:8083/core/comment/like' -d '{"comment_id":1}'
```

Res

```
{"code":200,"msg":"ok"}
```

## 取消新闻点赞 20171202

[POST] **application/json** `/core/news/unlike`

### Param

| param | type | require | description |
| --- | :---: | :---: | --- |
| news_id | string | true | 新闻id |

### Response

```
curl -X POST -H 'uid:27008002' -H "Content-type: application/json" -H "app_key:test_key" -H "access_token:rT843UYr4mhneBqW" 'http://localhost:8083/core/news/unlike' -d '{"news_id":1}'
```

Res

```
{"code":200,"msg":"ok"}
```

## 取消评论点赞 20171202

[POST] **application/json** `/core/comment/unlike`

### Param

| param | type | require | description |
| --- | :---: | :---: | --- |
| comment_id | string | true | 评论id |

### Response

```
curl -X POST -H 'uid:27008002' -H "Content-type: application/json" -H "app_key:test_key" -H "access_token:rT843UYr4mhneBqW" 'http://localhost:8083/core/comment/unlike' -d '{"comment_id":1}'
```

Res

```
{"code":200,"msg":"ok"}
```

## 获取首页列表 20171203

### API

[GET] `/core/news`

### Param

| param | type | require | description |
| --- | :---: | :---: | --- |
| index | int | false | 标识，首次传0, 之后根据上一次返回的index传过来即可, index=-1代表没有更多数据 |
| size | int | false | 返回数量，默认20, size>0 && size<=60 |
| game | string | false | wangzhe， chicken 默认wangzhe |


### Response

> 正常返回

```
curl 'http://localhost:8083/core/news?index=0&size=2&game=wangzhe'
```

Res

```
{
    "code": 200,
    "msg": "ok",
    "data": {
        "index": "1511268237000",
        "items": [
            {
                "news_id": 98,
                "nid": 346453,
                "title": "【2017赛事周刊】 第21期：八强相争 季后赛谁主沉浮",
                "tp": "综合",
                "news_ts": "1511268576000",
                "view_count": 107,
                "cover": "https://itea-cdn.qq.com/file/tgl/20171121/212x127.1511265432.02eeb74f44965b802323314675d26daa.212*127_13636.jpg",
                "video": "http://120.198.235.230/ugcyd.qq.com/flv/226/45/v05088ggtii.mp4",
                "game": "wangzhe",
                "comment_count": 0,
                "like_count":0
            },
            {
                "news_id": 99,
                "nid": 346432,
                "title": "事后诸葛亮第24期 迷神关羽绕后大招毁天灭地",
                "tp": "事后诸葛亮",
                "news_ts": "1511268237000",
                "view_count": 21903,
                "cover": "https://itea-cdn.qq.com/file/tgl/20171121/400x225.1511263557.5620890d3b1e80e59c5f9a8459a8e66e.400*225_37520.jpg",
                "video": "http://120.198.235.230/ugcyd.qq.com/flv/226/45/y0507dhpxzb.mp4",
                "game": "wangzhe",
                "comment_count": 0,
                "like_count":0
            }
        ]
    }
}
```

> 没有更多数据，判断index是否为-1

```
curl 'http://localhost:8083/core/news?index=-1'
```

Res

```
{
    "code": 200,
    "msg": "ok",
    "data": {
        "index": -1,
        "items": [ ]
    }
}
```

## 获取新闻详情 20171204

[GET] `/core/news/:news_id`

### Param

| param | type | require | description |
| --- | :---: | :---: | --- |
| news_id | int | true | 新闻ID，属于URL参数 |

### Response

> 正常返回

```
curl 'http://localhost:8083/core/news/6'
```

Res

```
{
    "code": 200,
    "msg": "ok",
    "data": {
        "news_id": 6,
        "nid": 330708,
        "title": "【KPL秋季赛】第6周 WeFun vs AG超玩会_1",
        "tp": "KPL",
        "news_ts": "1509173893000",
        "view_count": 0,
        "comment_count":5,
        "cover": "https://itea-cdn.qq.com/file/tgl/20171027/0.1509036733.2056077a00b5e89d0eb6793b06773159.230*140_71784.png",
        "url": "",
        "body": "<video controls=\"\" autoplay=\"\" name=\"media\"><source src=\"http://120.198.235.230/ugcyd.qq.com/flv/226/45/m0566771th6.mp4\" type=\"video/mp4\"></video>",
        "like_count":0,
        "is_like":false
    }
}
```

> 没有找到数据

```
curl 'http://localhost:8083/core/news/600'
```

Res

```
{"code":404,"msg":"没有找到相关数据"}
```

## 获取评论列表 20171205

[GET] `/core/comments`

### Param

| param | type | require | description |
| --- | :---: | :---: | --- |
| index | int | false | 标识，首次传0, 之后根据上一次返回的index传过来即可, index=-1代表没有更多数据 |
| size | int | false | 返回数量，默认20, size>0 && size<=60 |
| tp | string | true | 类型，首页列表的评论填 news ; 赛事评论填 race |
| target_id | string | true | 如果是首页列表评论，对应的是news_id, 如果是赛事的评论，对应的是race_id |

> 正常返回

```
curl 'http://localhost:8083/core/comments?index=0&size=20&tp=news&target_id=1'
```

Res

```
{
    "code": 200,
    "msg": "ok",
    "data": {
        "index": -1,
        "items": [
            {
                "comment": {
                    "comment_id": 5,
                    "replay_comment_id": 0,
                    "uid": "96008684",
                    "tp": "news",
                    "target_id": 1,
                    "content": "测试评论",
                    "create_ts": "1509263367999",
                    "like_count": 0,
                    "is_like": false
                },
                "user": {
                    "username": "15018329815",
                    "gender": "unknown",
                    "uid": "96008684",
                    "avatar": ""
                }
            },
            {
                "comment": {
                    "comment_id": 4,
                    "replay_comment_id": 0,
                    "uid": "96008684",
                    "tp": "news",
                    "target_id": 1,
                    "content": "测试评论",
                    "create_ts": "1509263327004",
                    "like_count": 0,
                    "is_like": false
                },
                "user": {
                    "username": "15018329815",
                    "gender": "unknown",
                    "uid": "96008684",
                    "avatar": ""
                }
            },
            {
                "comment": {
                    "comment_id": 3,
                    "replay_comment_id": 0,
                    "uid": "96008684",
                    "tp": "news",
                    "target_id": 1,
                    "content": "测试评论",
                    "create_ts": "1509263291729",
                    "like_count": 0,
                    "is_like": false
                },
                "user": {
                    "username": "15018329815",
                    "gender": "unknown",
                    "uid": "96008684",
                    "avatar": ""
                }
            },
            {
                "comment": {
                    "comment_id": 2,
                    "replay_comment_id": 0,
                    "uid": "96008684",
                    "tp": "news",
                    "target_id": 1,
                    "content": "测试评论",
                    "create_ts": "1509263277942",
                    "like_count": 0,
                    "is_like": false
                },
                "user": {
                    "username": "15018329815",
                    "gender": "unknown",
                    "uid": "96008684",
                    "avatar": ""
                }
            },
            {
                "comment": {
                    "comment_id": 1,
                    "replay_comment_id": 0,
                    "uid": "96008684",
                    "tp": "news",
                    "target_id": 1,
                    "content": "测试评论",
                    "create_ts": "1509263142027",
                    "like_count": 0,
                    "is_like": false
                },
                "user": {
                    "username": "15018329815",
                    "gender": "unknown",
                    "uid": "96008684",
                    "avatar": ""
                }
            }
        ]
    }
}
```

## 获取当前签到情况 20171211

[GET] `/core/coin`

### Response

```
curl -H 'uid:27008002' -H "access_token:rT843UYr4mhneBqW" 'http://localhost:8083/core/coin'
```

Res

> gift_coin告诉你每天签到能够拿到的竞猜币，day代表当前是第几天签到

```
{
    "code": 200,
    "msg": "ok",
    "data": {
        "coin": 9202,
        "sign_in": {
            "has_sign": true,
            "day": 1,
            "gift_coin": [
                1,
                2,
                4,
                8,
                16
            ]
        }
    }
}
```

## 签到 20171211

[GET] `/core/sign_in`

### Response

```
curl -H 'uid:27008002' -H "access_token:rT843UYr4mhneBqW" 'http://localhost:8083/core/sign_in'
```

Res

> 注意： coin是当前用户的竞猜币，gift_coin告诉你每天签到能够拿到的竞猜币，day代表当前是第几天签到

```
{
    "code": 200,
    "msg": "ok",
    "data": {
        "coin": 9202,
        "sign_in": {
            "has_sign": true,
            "day": 1,
            "gift_coin": [
                1,
                2,
                4,
                8,
                16
            ]
        }
    }
}
```

## 参与竞猜 20171217

[POST] **application/json** `/core/betting`

### Param

> 注意，这个betting_item_id_list是数组

| param | type | require | description |
| --- | :---: | :---: | --- |
| coin | int | true | 竞猜币数量 |
| betting_item_id_list | array | true | betting_item_id数组, 例如"betting_item_id_list": [1] |

### Response

```
curl -X POST -H 'uid:27008002' -H "Content-type: application/json" -d '{"coin": 500, "betting_item_id_list": [1]}' http://localhost:8083/core/betting
```

Res

```
{"code":200,"msg":"ok"}
```

> 竞猜币不足

```
{"code":998,"msg":"竞猜币不足"}
```

## 获取推荐新闻 20180131

[GET] `/core/news/recommend/:game/:news_id`

| param | type | require | description |
| --- | :---: | :---: | --- |
| game | string | false | wangzhe， chicken 属于URL参数|
| news_id | int | true | 新闻ID，属于URL参数 |

### Response

```
curl 'http://localhost:8083/core/news/recommend/wangzhe/1'
```

Res

```
{
    "code": 200,
    "msg": "ok",
    "data": {
        "index": -1,
        "items": [
            {
                "news_id": 142,
                "nid": 344579,
                "title": "QGhappy赛前群访：迎战JC我们有秘密武器",
                "tp": "资讯",
                "news_ts": "1511060157000",
                "view_count": 958,
                "cover": "https://itea-cdn.qq.com/file/tgl/20171119/303.1511056738.bf22c4bff89aecf57fce1e579b15c419.360*203_21455.jpg",
                "video": "",
                "game": "wangzhe",
                "comment_count": 0,
                "like_count": 0
            },
            {
                "news_id": 100,
                "nid": 345690,
                "title": "八强巡礼：eStar 不灭星辰，永恒荣耀",
                "tp": "资讯",
                "news_ts": "1511257787000",
                "view_count": 462,
                "cover": "https://itea-cdn.qq.com/file/tgl/20171121/1511254257.89467eae393da33c433f31059c525d9f.jpg",
                "video": "",
                "game": "wangzhe",
                "comment_count": 0,
                "like_count": 0
            },
            {
                "news_id": 202,
                "nid": 342324,
                "title": "八强巡礼：QGhappy王朝将临",
                "tp": "资讯",
                "news_ts": "1510752473000",
                "view_count": 987,
                "cover": "https://itea-cdn.qq.com/file/tgl/20171115/30.1510748449.56e17fdc0cb0e65b2859a488adef7d56.360*203_24826.jpg",
                "video": "",
                "game": "wangzhe",
                "comment_count": 0,
                "like_count": 0
            }
        ]
    }
}
```

## 获取赛程列表 20180131

[GET] `/core/races`

### Param

| param | type | require | description |
| --- | :---: | :---: | --- |
| index | String | false | 标识，首次传0, 之后根据上一次返回的index传过来即可, index=-1代表没有更多数据 |
| size | int | false | 返回数量，默认7, size>0 && size<=60 |

### Response

> 正常放回

```
curl 'http://localhost:8083/core/races?index=0&size=7'
```

Res

```
{
    "code": 200,
    "msg": "ok",
    "data": {
        "total":"602",
        "index": 20171105,
        "items": [
            {
                "dt": 20171109,
                "items": [
                    {
                        "race_id": 297,
                        "race_info_id": 6,
                        "game_id": 1,
                        "score_a": "0",
                        "score_b": "0",
                        "race_ts": "1510232400000",
                        "create_ts": "1509357587627",
                        "status": "ready",
                        "team_a": {
                            "team_id": 8,
                            "team_name": "AS仙阁",
                            "short_name": "AS仙阁",
                            "logo": "http://ossweb-img.qq.com/htdocs/weiguanwang/smoba/phpXFeqVI_915848246_1504852999.png",
                            "create_ts": "1509302181802"
                        },
                        "team_b": {
                            "team_id": 5,
                            "team_name": "XQ",
                            "short_name": "X-QUEST",
                            "logo": "http://ossweb-img.qq.com/htdocs/weiguanwang/smoba/phpAsQ8en_55863151_1504853133.png",
                            "create_ts": "1509302181797"
                        }
                    },
                    {
                        "race_id": 296,
                        "race_info_id": 6,
                        "game_id": 1,
                        "score_a": "0",
                        "score_b": "0",
                        "race_ts": "1510227000000",
                        "create_ts": "1509357587626",
                        "status": "ready",
                        "team_a": {
                            "team_id": 6,
                            "team_name": "JC",
                            "short_name": "JC",
                            "logo": "http://ossweb-img.qq.com/htdocs/weiguanwang/smoba/phppSw69l_1928455556_1489140572.png",
                            "create_ts": "1509302181798"
                        },
                        "team_b": {
                            "team_id": 2,
                            "team_name": "AG超玩会",
                            "short_name": "AG",
                            "logo": "http://ossweb-img.qq.com/htdocs/weiguanwang/smoba/php2gzntz_468365754_1489057020.png",
                            "create_ts": "1509302181793"
                        }
                    },
                    {
                        "race_id": 295,
                        "race_info_id": 6,
                        "game_id": 1,
                        "score_a": "0",
                        "score_b": "0",
                        "race_ts": "1510221600000",
                        "create_ts": "1509357587626",
                        "status": "ready",
                        "team_a": {
                            "team_id": 11,
                            "team_name": "RNG.M",
                            "short_name": "RNG.M",
                            "logo": "http://ossweb-img.qq.com/htdocs/weiguanwang/smoba/phpE0o8R8_1073428518_1505269754.png",
                            "create_ts": "1509302181808"
                        },
                        "team_b": {
                            "team_id": 9,
                            "team_name": "sViper",
                            "short_name": "sViper",
                            "logo": "http://ossweb-img.qq.com/htdocs/weiguanwang/smoba/phps09l4L_852880468_1504853493.png",
                            "create_ts": "1509302181805"
                        }
                    }
                ]
            },
            {
                "dt": 20171105,
                "items": [
                    {
                        "race_id": 294,
                        "race_info_id": 6,
                        "game_id": 1,
                        "score_a": "0",
                        "score_b": "0",
                        "race_ts": "1509886800000",
                        "create_ts": "1509357587625",
                        "status": "ready",
                        "team_a": {
                            "team_id": 8,
                            "team_name": "AS仙阁",
                            "short_name": "AS仙阁",
                            "logo": "http://ossweb-img.qq.com/htdocs/weiguanwang/smoba/phpXFeqVI_915848246_1504852999.png",
                            "create_ts": "1509302181802"
                        },
                        "team_b": {
                            "team_id": 2,
                            "team_name": "AG超玩会",
                            "short_name": "AG",
                            "logo": "http://ossweb-img.qq.com/htdocs/weiguanwang/smoba/php2gzntz_468365754_1489057020.png",
                            "create_ts": "1509302181793"
                        }
                    },
                    {
                        "race_id": 293,
                        "race_info_id": 6,
                        "game_id": 1,
                        "score_a": "0",
                        "score_b": "0",
                        "race_ts": "1509881400000",
                        "create_ts": "1509357587624",
                        "status": "ready",
                        "team_a": {
                            "team_id": 9,
                            "team_name": "sViper",
                            "short_name": "sViper",
                            "logo": "http://ossweb-img.qq.com/htdocs/weiguanwang/smoba/phps09l4L_852880468_1504853493.png",
                            "create_ts": "1509302181805"
                        },
                        "team_b": {
                            "team_id": 1,
                            "team_name": "QGhappy",
                            "short_name": "QG",
                            "logo": "http://ossweb-img.qq.com/htdocs/weiguanwang/smoba/phpsTEvZs_877137796_1489139248.png",
                            "create_ts": "1509302181789"
                        }
                    },
                    {
                        "race_id": 292,
                        "race_info_id": 6,
                        "game_id": 1,
                        "score_a": "0",
                        "score_b": "0",
                        "race_ts": "1509876000000",
                        "create_ts": "1509357587623",
                        "status": "ready",
                        "team_a": {
                            "team_id": 4,
                            "team_name": "WF",
                            "short_name": "WF",
                            "logo": "http://ossweb-img.qq.com/htdocs/weiguanwang/smoba/php8FoNtq_1043328301_1489139259.png",
                            "create_ts": "1509302181796"
                        },
                        "team_b": {
                            "team_id": 11,
                            "team_name": "RNG.M",
                            "short_name": "RNG.M",
                            "logo": "http://ossweb-img.qq.com/htdocs/weiguanwang/smoba/phpE0o8R8_1073428518_1505269754.png",
                            "create_ts": "1509302181808"
                        }
                    }
                ]
            }
        ]
    }
}
```

# 获取热门比赛 20180203

[GET] `/core/races/hot`

### Response

```
curl http://localhost:8083/core/races/hot
```

Res

```
{
    "code": 200,
    "msg": "ok",
    "data": [
        {
            "race_id": 602,
            "race_info_id": 18,
            "game_id": 10,
            "score_a": "0",
            "score_b": "0",
            "race_ts": "1511416800000",
            "create_ts": "1511272575967",
            "status": "ready",
            "is_hot": 1,
            "team_a": {
                "team_id": 329,
                "team_name": "Kinguin",
                "short_name": "Kinguin",
                "logo": "http://dl2.img.3iuu.com/attachments/dd70/8020/a71a809d47d5cd1aede75920/1510915152464.jpg",
                "create_ts": "1510936671564"
            },
            "team_b": {
                "team_id": 330,
                "team_name": "Vega",
                "short_name": "Vega",
                "logo": "http://dl2.img.3iuu.com/attachments/3d48/a694/56ae7bfc80046016664c9eec/1510042839004.jpg",
                "create_ts": "1510936671895"
            },
            "race_name": "DOTA2-完美大师赛-胜者组四分之一决赛"
        }
    ]
}
```

# 获取竞猜列表 20180204

[GET] `/core/races2`

| param | type | require | description |
| --- | :---: | :---: | --- |
| index | String | false | 标识，首次传0, 之后根据上一次返回的index传过来即可 |
| size | int | false | 返回数量，默认7, size>0 && size<=60 |
| sort | String | true | asc 往后获取 desc 往前获取 |

### Response

```
curl 'http://localhost:8083/core/races2?index=20180203_20171112&size=3&sort=desc'
```

Res

```
{
    "code": 200,
    "msg": "ok",
    "data": {
        "index": "20180203_20171109",
        "items": [
            {
                "race_id": 573,
                "race_info_id": 14,
                "game_id": 9,
                "score_a": "0",
                "score_b": "2",
                "race_ts": "1510405200000",
                "create_ts": "1510974730107",
                "status": "end",
                "is_hot": 0,
                "team_a": {
                    "team_id": 315,
                    "team_name": "eStar",
                    "short_name": "eStar",
                    "logo": "http://dl2.img.3iuu.com/attachments/08e1/deb0/88599cbd82d7340b3bff4700/1494330774453.jpg",
                    "create_ts": "1510936653385"
                },
                "team_b": {
                    "team_id": 312,
                    "team_name": "AG超玩会",
                    "short_name": "AG超玩会",
                    "logo": "http://dl2.img.3iuu.com/attachments/6678/ba8b/245f19cb039438e3086875e1/1494330494203.jpg",
                    "create_ts": "1510936652735"
                },
                "race_name": "王者荣耀-KPL-胜者组第一轮"
            },
            {
                "race_id": 574,
                "race_info_id": 14,
                "game_id": 9,
                "score_a": "0",
                "score_b": "2",
                "race_ts": "1510399800000",
                "create_ts": "1510974730783",
                "status": "end",
                "is_hot": 0,
                "team_a": {
                    "team_id": 311,
                    "team_name": "GK",
                    "short_name": "GK",
                    "logo": "http://dl2.img.3iuu.com/attachments/b7cf/3ab1/7ba7a0e1048414655d5df2e4/1494330598458.jpg",
                    "create_ts": "1510936652734"
                },
                "team_b": {
                    "team_id": 316,
                    "team_name": "AS仙阁",
                    "short_name": "AS仙阁",
                    "logo": "http://dl2.img.3iuu.com/attachments/120d/f55a/e0acda6cecad3f47b4f84b62/1494330505002.jpg",
                    "create_ts": "1510936653758"
                },
                "race_name": "王者荣耀-KPL-胜者组第一轮"
            },
            {
                "race_id": 575,
                "race_info_id": 14,
                "game_id": 9,
                "score_a": "2",
                "score_b": "0",
                "race_ts": "1510394400000",
                "create_ts": "1510974731404",
                "status": "end",
                "is_hot": 0,
                "team_a": {
                    "team_id": 309,
                    "team_name": "EDG.M",
                    "short_name": "EDG.M",
                    "logo": "http://dl2.img.3iuu.com/attachments/e130/86a3/4de95b02b624b7c402b45166/1500625495702.jpg",
                    "create_ts": "1510936652396"
                },
                "team_b": {
                    "team_id": 313,
                    "team_name": "YTG",
                    "short_name": "YTG",
                    "logo": "http://dl2.img.3iuu.com/attachments/713b/88ce/2cf91f25d894bdd8f77be2ae/1494330584659.jpg",
                    "create_ts": "1510936653032"
                },
                "race_name": "王者荣耀-KPL-胜者组第一轮"
            },
            {
                "race_id": 576,
                "race_info_id": 14,
                "game_id": 9,
                "score_a": "1",
                "score_b": "2",
                "race_ts": "1510318800000",
                "create_ts": "1510974732092",
                "status": "end",
                "is_hot": 0,
                "team_a": {
                    "team_id": 315,
                    "team_name": "eStar",
                    "short_name": "eStar",
                    "logo": "http://dl2.img.3iuu.com/attachments/08e1/deb0/88599cbd82d7340b3bff4700/1494330774453.jpg",
                    "create_ts": "1510936653385"
                },
                "team_b": {
                    "team_id": 311,
                    "team_name": "GK",
                    "short_name": "GK",
                    "logo": "http://dl2.img.3iuu.com/attachments/b7cf/3ab1/7ba7a0e1048414655d5df2e4/1494330598458.jpg",
                    "create_ts": "1510936652734"
                },
                "race_name": "王者荣耀-KPL-胜者组第一轮"
            },
            {
                "race_id": 577,
                "race_info_id": 14,
                "game_id": 9,
                "score_a": "2",
                "score_b": "0",
                "race_ts": "1510313400000",
                "create_ts": "1510974732828",
                "status": "end",
                "is_hot": 0,
                "team_a": {
                    "team_id": 317,
                    "team_name": "XQ",
                    "short_name": "XQ",
                    "logo": "http://dl2.img.3iuu.com/attachments/4084/d609/4c8d5a37dce044d4b4fc3573/1494330757419.jpg",
                    "create_ts": "1510936654723"
                },
                "team_b": {
                    "team_id": 318,
                    "team_name": "JC",
                    "short_name": "JC",
                    "logo": "http://dl2.img.3iuu.com/attachments/dd09/11d7/5416fe74d7f86a1b6082acf9/1494330570384.jpg",
                    "create_ts": "1510936654724"
                },
                "race_name": "王者荣耀-KPL-胜者组第一轮"
            },
            {
                "race_id": 578,
                "race_info_id": 14,
                "game_id": 9,
                "score_a": "1",
                "score_b": "2",
                "race_ts": "1510308000000",
                "create_ts": "1510974733501",
                "status": "end",
                "is_hot": 0,
                "team_a": {
                    "team_id": 319,
                    "team_name": "SViper",
                    "short_name": "SViper",
                    "logo": "http://dl2.img.3iuu.com/attachments/2f06/ec15/4ea6dcab4305d9bdd17f47ce/1494330735369.jpg",
                    "create_ts": "1510936665032"
                },
                "team_b": {
                    "team_id": 313,
                    "team_name": "YTG",
                    "short_name": "YTG",
                    "logo": "http://dl2.img.3iuu.com/attachments/713b/88ce/2cf91f25d894bdd8f77be2ae/1494330584659.jpg",
                    "create_ts": "1510936653032"
                },
                "race_name": "王者荣耀-KPL-胜者组第一轮"
            },
            {
                "race_id": 579,
                "race_info_id": 14,
                "game_id": 9,
                "score_a": "0",
                "score_b": "2",
                "race_ts": "1510232400000",
                "create_ts": "1510974734133",
                "status": "end",
                "is_hot": 0,
                "team_a": {
                    "team_id": 316,
                    "team_name": "AS仙阁",
                    "short_name": "AS仙阁",
                    "logo": "http://dl2.img.3iuu.com/attachments/120d/f55a/e0acda6cecad3f47b4f84b62/1494330505002.jpg",
                    "create_ts": "1510936653758"
                },
                "team_b": {
                    "team_id": 317,
                    "team_name": "XQ",
                    "short_name": "XQ",
                    "logo": "http://dl2.img.3iuu.com/attachments/4084/d609/4c8d5a37dce044d4b4fc3573/1494330757419.jpg",
                    "create_ts": "1510936654723"
                },
                "race_name": "王者荣耀-KPL-胜者组第一轮"
            }
        ]
    }
}
```

## 获取竞猜币套餐 20180302

[GET] `/core/coin/plans`

### Response

注意：fee 的单位为分

> 正常返回

```
curl http://localhost:8083/core/coin/plans
```

Res

```
{
    "code": 200,
    "msg": "ok",
    "data": [
        {
            "coin_plan_id": 1,
            "fee": 600,
            "coin_count": 400,
            "gift_name": "鲜花",
            "gift_count": 1
        },
        {
            "coin_plan_id": 2,
            "fee": 3000,
            "coin_count": 600,
            "gift_name": "砖石",
            "gift_count": 1
        },
        {
            "coin_plan_id": 3,
            "fee": 6800,
            "coin_count": 1000,
            "gift_name": "豪车",
            "gift_count": 1
        },
        {
            "coin_plan_id": 4,
            "fee": 12800,
            "coin_count": 30000,
            "gift_name": "邮轮",
            "gift_count": 1
        }
    ]
}
```

## 获取用户信息 20180303

[GET] `/core/user`

### Response

```
curl -H 'app_key: test_key' -H 'pt: app' -H 'uid: 27008002' -H 'access_token:rT843UYr4mhneBqW' http://localhost:8083/core/user
```

Res

```
{
    "code": 200,
    "msg": "ok",
    "data": {
        "uid": "27008002",
        "coin": 9702,
        "tel": "",
        "username": "hh",
        "gender": "female",
        "avatar": "http://wx.qlogo.cn/mmopen/vi_32/9icoOxiatBlS91mriaJWBvCGHEsw1N8XibwJPNLAQdyYHic7bdqUG4TqbIDX58KmP7InBWdHPU8tEQU0WdgH8tGmB5A/0",
        "coin_gift": [
            {
                "coin_plan_id": 1,
                "gift_name": "鲜花",
                "total_gift": 0
            },
            {
                "coin_plan_id": 2,
                "gift_name": "砖石",
                "total_gift": 0
            },
            {
                "coin_plan_id": 3,
                "gift_name": "豪车",
                "total_gift": 0
            },
            {
                "coin_plan_id": 4,
                "gift_name": "邮轮",
                "total_gift": 0
            }
        ]{
             "code": 200,
             "msg": "ok",
             "data": {
                 "race": {
                     "race_id": 516,
                     "race_info_id": 13,
                     "game_id": 8,
                     "score_a": "3",
                     "score_b": "2",
                     "race_ts": "1508659200000",
                     "create_ts": "1510974462003",
                     "status": "end",
                     "is_hot": 0,
                     "team_a": {
                         "team_id": 299,
                         "team_name": "WE",
                         "short_name": "WE",
                         "logo": "http://dl2.img.3iuu.com/attachments/419d/0729/127eb4ce77a24386036e8a04/1494484019963.jpg",
                         "create_ts": "1510936456368"
                     },
                     "team_b": {
                         "team_id": 301,
                         "team_name": "C9",
                         "short_name": "C9",
                         "logo": "http://dl2.img.3iuu.com/attachments/43be/1a27/ca950a5db1f4d16ac308e8c2/1503925576338.jpg",
                         "create_ts": "1510936648418"
                     },
                     "team_a_gift": [
                         {
                             "coin_plan_id": 1,
                             "gift_name": "鲜花",
                             "total_gift": 0
                         },
                         {
                             "coin_plan_id": 2,
                             "gift_name": "砖石",
                             "total_gift": 0
                         },
                         {
                             "coin_plan_id": 3,
                             "gift_name": "豪车",
                             "total_gift": 0
                         },
                         {
                             "coin_plan_id": 4,
                             "gift_name": "邮轮",
                             "total_gift": 0
                         }
                     ],
                     "team_b_gift": [
                         {
                             "coin_plan_id": 1,
                             "gift_name": "鲜花",
                             "total_gift": 0
                         },
                         {
                             "coin_plan_id": 2,
                             "gift_name": "砖石",
                             "total_gift": 0
                         },
                         {
                             "coin_plan_id": 3,
                             "gift_name": "豪车",
                             "total_gift": 0
                         },
                         {
                             "coin_plan_id": 4,
                             "gift_name": "邮轮",
                             "total_gift": 0
                         }
                     ],
                     "description": "",
                     "race_name": "英雄联盟-全球总决赛-淘汰赛第四天",
                     "start_ts": "0",
                     "end_ts": "0"
                 },
                 "betting_tps": [
                     {
                         "tp": "0",
                         "tp_name": "总局"
                     },
                     {
                         "tp": "总局",
                         "tp_name": "第总局局"
                     },
                     {
                         "tp": "第1局",
                         "tp_name": "第第1局局"
                     },
                     {
                         "tp": "第2局",
                         "tp_name": "第第2局局"
                     },
                     {
                         "tp": "第3局",
                         "tp_name": "第第3局局"
                     },
                     {
                         "tp": "第4局",
                         "tp_name": "第第4局局"
                     },
                     {
                         "tp": "第5局",
                         "tp_name": "第第5局局"
                     },
                     {
                         "tp": "1",
                         "tp_name": "第1局"
                     },
                     {
                         "tp": "2",
                         "tp_name": "第2局"
                     },
                     {
                         "tp": "3",
                         "tp_name": "第3局"
                     },
                     {
                         "tp": "4",
                         "tp_name": "第4局"
                     },
                     {
                         "tp": "5",
                         "tp_name": "第5局"
                     }
                 ]
             }
         }
    }
}
```

## 获取比赛详情数据（v2）20180303

[GET] `/core/race2/:race_id`

### Param

| param | type | require | description |
| --- | :---: | :---: | --- |
| race_id | string | true | 属于URL参数 |

### Response

```
curl 'http://localhost:8083/core/race2/516'
```

Res

> 注意 betting_tps 用户获取竞猜项用

```
{
    "code": 200,
    "msg": "ok",
    "data": {
        "race": {
            "race_id": 516,
            "race_info_id": 13,
            "game_id": 8,
            "score_a": "3",
            "score_b": "2",
            "race_ts": "1508659200000",
            "create_ts": "1510974462003",
            "status": "end",
            "is_hot": 0,
            "team_a": {
                "team_id": 299,
                "team_name": "WE",
                "short_name": "WE",
                "logo": "http://dl2.img.3iuu.com/attachments/419d/0729/127eb4ce77a24386036e8a04/1494484019963.jpg",
                "create_ts": "1510936456368"
            },
            "team_b": {
                "team_id": 301,
                "team_name": "C9",
                "short_name": "C9",
                "logo": "http://dl2.img.3iuu.com/attachments/43be/1a27/ca950a5db1f4d16ac308e8c2/1503925576338.jpg",
                "create_ts": "1510936648418"
            },
            "team_a_gift": [
                {
                    "coin_plan_id": 1,
                    "gift_name": "鲜花",
                    "total_gift": 0
                },
                {
                    "coin_plan_id": 2,
                    "gift_name": "砖石",
                    "total_gift": 0
                },
                {
                    "coin_plan_id": 3,
                    "gift_name": "豪车",
                    "total_gift": 0
                },
                {
                    "coin_plan_id": 4,
                    "gift_name": "邮轮",
                    "total_gift": 0
                }
            ],
            "team_b_gift": [
                {
                    "coin_plan_id": 1,
                    "gift_name": "鲜花",
                    "total_gift": 0
                },
                {
                    "coin_plan_id": 2,
                    "gift_name": "砖石",
                    "total_gift": 0
                },
                {
                    "coin_plan_id": 3,
                    "gift_name": "豪车",
                    "total_gift": 0
                },
                {
                    "coin_plan_id": 4,
                    "gift_name": "邮轮",
                    "total_gift": 0
                }
            ],
            "description": "",
            "race_name": "英雄联盟-全球总决赛-淘汰赛第四天",
            "start_ts": "0",
            "end_ts": "0"
        },
        "betting_tps": [
            {
                "tp": "0",
                "tp_name": "总局"
            },
            {
                "tp": "总局",
                "tp_name": "第总局局"
            },
            {
                "tp": "第1局",
                "tp_name": "第第1局局"
            },
            {
                "tp": "第2局",
                "tp_name": "第第2局局"
            },
            {
                "tp": "第3局",
                "tp_name": "第第3局局"
            },
            {
                "tp": "第4局",
                "tp_name": "第第4局局"
            },
            {
                "tp": "第5局",
                "tp_name": "第第5局局"
            },
            {
                "tp": "1",
                "tp_name": "第1局"
            },
            {
                "tp": "2",
                "tp_name": "第2局"
            },
            {
                "tp": "3",
                "tp_name": "第3局"
            },
            {
                "tp": "4",
                "tp_name": "第4局"
            },
            {
                "tp": "5",
                "tp_name": "第5局"
            }
        ]
    }
}
```