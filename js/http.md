# http相关

## 1.缓存header

Expires、Cache-Control

If-Modified-Since/Last-Modified

If-None-Match/ETag

Expires服务器返回的时间不准确
Cache-Control max-age返回一个相对的时间
Last-Modified返回上一次请求的时间
If-Modified-Since第二次请求以后携带上上次请求的时间
ETag每次服务器返回一个标识
If-None-Match每次请求携带上
