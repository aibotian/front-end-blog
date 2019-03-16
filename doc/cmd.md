## linux常用命令

1. curl

>获取网页内容

```curl http://www.baidu.com```

>获取http头, 不获取内容

```curl -I http://www.baidu.com```

>同时获取http头和内容

```curl -i http://www.baidu.com```

>发送请求(-d发送POST请求，-X发送请求方式GET或者POST)

```curl -d "userName=tom&passwd=12345" -X POST http://www.example.com/login```

如果省略-X，默认为发送POST请求

```curl -d "userName=tom&passwd=12345" http://www.example.com/login```

还可以强制使用GET方式

```curl -d "userName=tom&passwd=12345" -X GET http://www.example.com/login```

>返回部分内容、测试http请求206、416状态码(Accept-Ranges、Content-Range、Content-Length),指定range

```curl -r 0-10 -i http://127.0.0.1:9527/LICENSE```
 





