# Update apk

```
cp app/build/outputs/apk/release/app-release.apk ~/ts/CloudServer/UpdateServer/gogo/app-release.apk
scp -r UpdateServer/gogo/* root@xd:/usr/share/nginx/html/gogo/
```

