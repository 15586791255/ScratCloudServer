# Update apk

```
adb install -r ~/ts/GoGo/app/build/outputs/apk/release/app-release.apk
cp ~/ts/GoGo/app/build/outputs/apk/release/app-release.apk ~/ts/CloudServer/UpdateServer/gogo/app-release.apk
scp -r ~/ts/CloudServer/UpdateServer/gogo/* root@xd:/usr/share/nginx/html/gogo/
```

