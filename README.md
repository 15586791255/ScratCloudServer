
# Server API for Gogo

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