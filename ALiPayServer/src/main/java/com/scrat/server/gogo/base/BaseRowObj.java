package com.scrat.server.gogo.base;

import java.util.Map;

/**
 * Created by scrat on 2017/11/6.
 */
public class BaseRowObj {
    public static final BaseRowObj EMPTY = new BaseRowObj(null);

    private Map<String, Object> map;

    public BaseRowObj(Map<String, Object> map) {
        this.map = map;
    }

    public boolean isEmpty() {
        return map == null;
    }

    public String opt(String key, String defaultValue) {
        Object obj = map.get(key);

        if (obj == null) {
            return defaultValue;
        }

        return String.valueOf(obj);
    }

    public String optString(String key, String defaultValue) {
        return opt(key, defaultValue);
    }

    public String optString(String key) {
        return opt(key, "");
    }

    public int opt(String key, int defaultValue) {
        String str = opt(key, "");

        if (str == null || "".equals(str)) {
            return defaultValue;
        }

        try {
            return Integer.parseInt(str);
        } catch (Exception e) {
            return defaultValue;
        }
    }

    public int optInt(String key, int defaultValue) {
        return opt(key, defaultValue);
    }

    public int optInt(String key) {
        return opt(key, 0);
    }

    public long opt(String key, long defaultValue) {
        String str = opt(key, "");

        if (str == null || "".equals(str)) {
            return defaultValue;
        }

        try {
            return Long.parseLong(str);
        } catch (Exception e) {
            return defaultValue;
        }
    }

    public long optLong(String key, long defaultValue) {
        return opt(key, defaultValue);
    }

    public long optLong(String key) {
        return opt(key, 0L);
    }

    @Override
    public String toString() {
        return "BaseRowObj{" +
                "map=" + map +
                '}';
    }
}
