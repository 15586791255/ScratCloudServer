
# Server API for Gogo

全局Header

| param | type | require | description |
| --- | :---: | :---: | --- |
| pt | string | true | 平台，`iOS`和`Android`请填app |
| app_key | string | true | 由服务端提供 |
| access_token | string | false | 如果已经登录，请带上登录的时候返回的access_token |

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

## 获取首页列表

### API

[GET] `/core/news`

### Param

| param | type | require | description |
| --- | :---: | :---: | --- |
| index | int | false | 标识，首次传0, 之后根据上一次返回的index传过来即可, index=-1代表没有更多数据 |
| size | int | false | 返回数量，默认20, size>0 && size<=60 |


### Response

> 正常返回

```
curl 'http://localhost:8083/core/news?index=0&size=2'
```

Res

```
{
    "code": 200,
    "msg": "ok",
    "data": {
        "index": 5,
        "items": [
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

## 获取新闻详情

[GET] `/news/:news_id`

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
        "cover": "https://itea-cdn.qq.com/file/tgl/20171027/0.1509036733.2056077a00b5e89d0eb6793b06773159.230*140_71784.png",
        "url": "",
        "body": "<video controls=\"\" autoplay=\"\" name=\"media\"><source src=\"http://120.198.235.230/ugcyd.qq.com/flv/226/45/m0566771th6.mp4\" type=\"video/mp4\"></video>"
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

[POST] **application/json** `/:uid/token`

### Param

| param | type | require | description |
| --- | :---: | :---: | --- |
| uid | string | true | 用户ID，属于url参数 |
| refresh_token | string | true | 刷新令牌 |

### Response

> 正常返回

```
curl -X POST -H "Content-type: application/json" -H "app_key: test_key" -H "pt: app" -d '{"refresh_token": "bGDep7WTLCIqjlTw"}' 'http://localhost:8082/account/96008684/token'
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
curl -X POST -H "Content-type: application/json" -H "app_key: test_key" -H "pt: app" -d '{"refresh_token": "bGDep7WTLCIqjlTw"}' 'http://localhost:8082/account/960086845/token'
```

Res

```
{"code":404,"msg":"登录信息异常"}
```

> 登录超时

```
curl -X POST -H "Content-type: application/json" -H "app_key: test_key" -H "pt: app" -d '{"refresh_token": "huuWBBCRC2sO1dMk"}' 'http://localhost:8082/account/96008684/token'
```

Res

```
{"code":403,"msg":"登录超时"}
```

