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

## 获取评论列表

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
                    "create_ts": "1509263367999"
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
                    "create_ts": "1509263327004"
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
                    "create_ts": "1509263291729"
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
                    "create_ts": "1509263277942"
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
                    "create_ts": "1509263142027"
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

## 获取赛程列表

[GET] `/core/races`

### Param

| param | type | require | description |
| --- | :---: | :---: | --- |
| index | int | false | 标识，首次传0, 之后根据上一次返回的index传过来即可, index=-1代表没有更多数据 |
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

## 获取竞猜币套餐

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
            "coin_count": 400
        },
        {
            "coin_plan_id": 2,
            "fee": 3000,
            "coin_count": 600
        },
        {
            "coin_plan_id": 3,
            "fee": 6800,
            "coin_count": 1000
        },
        {
            "coin_plan_id": 4,
            "fee": 12800,
            "coin_count": 30000
        }
    ]
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

## 获取用户信息

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
        "coin": 0,
        "username": "18924212953",
        "gender": "male",
        "avatar": "http://wx.qlogo.cn/mmopen/vi_32/9icoOxiatBlS91mriaJWBvCGHEsw1N8XibwJPNLAQdyYHic7bdqUG4TqbIDX58KmP7InBWdHPU8tEQU0WdgH8tGmB5A/0"
    }
}
```