package com.scrat.server.gogo.base;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by scrat on 2017/11/6.
 */
public abstract class BaseController {

    protected ResBuilder res() {
        return new ResBuilder();
    }

    protected MapBuilder map() {
        return new MapBuilder();
    }

    public static class ResBuilder {
        Map<String, Object> res;

        public ResBuilder() {
            res = new HashMap<>();
            res.put("code", 200);
            res.put("msg", "ok");
        }

        public ResBuilder code(int code) {
            res.put("code", code);
            return this;
        }

        public ResBuilder msg(String msg) {
            res.put("msg", msg);
            return this;
        }

        public ResBuilder data(Object obj) {
            res.put("data", obj);
            return this;
        }

        public Map<String, Object> build() {
            return res;
        }
    }

    public static class MapBuilder {
        Map<String, Object> map;

        public MapBuilder() {
            map = new HashMap<>();
        }

        public MapBuilder put(String key, Object value) {
            map.put(key, value);
            return this;
        }

        public Map<String, Object> build() {
            return map;
        }
    }
}
