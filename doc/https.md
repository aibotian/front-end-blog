## http-server开启本地https服务

有时开发环境测试一些协议引入资源我们不便于来回切换环境，所以在本地开启https服务方便测试


#### 生成秘钥对

```
  openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
```

* 填写域名时注意域名要匹配上 eg:我的主机ip 192.168.0.1

```
双击 cert.pem
```


#### 钥匙串 ->  导出证书到桌面 -> 钥匙串【系统】上右件-> 添加钥匙串【导入桌面上的钥匙串添加进来】

```
hs -S
```

*hs 是http-server简写, -S开启https服务
