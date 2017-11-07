
## Config in Nginx

```
location /api/pay/alipay/ {
    proxy_pass http://localhost:8085/alipay/;
}
```

## Restart Nginx

```
$ nginx -t
$ nginx -s reload
```

## Add Maven dependence

```
mvn install:install-file -Dfile=src/main/webapp/WEB-INF/lib/alipay-sdk-java20171027120314.jar -DgroupId=com.alipay -DartifactId=api -Dversion=20171027120314 -Dpackaging=jar
```

## Package

```
$ mvn clean package
$ java -jar target/alipay-0.1.0.jar --spring.config.location=src/main/resources/application.properties
```

## Test

```
curl http://localhost:8085/alipay/test
```

nohup java -jar alipay-0.1.0.jar --spring.config.location=alipay-0.1.0.application.properties > alipay-0.1.0.log &