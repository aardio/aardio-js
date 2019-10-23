# aardio服务接口描述语言（AASDL）

因为js语言不能像aardio那样，把rest-rpc,json-rpc提供的远程函数方便的自动转换为JS中的函数对象，aardio制定出aasdl使我们可以用最简单的方法快速的编写RPC客户端，并可以基于aasdl提供的接口描述自动封装JS函数对象，以实现更愉快、更简洁的与服务端交互。

## 1、关于 rest-rpc 

在aardio中的实现为标准库中的 web.rest，可以将任何第三方的普通HTTP API轻松的转换为aardio中的函数对象。参考：http://bbs.aardio.com/forum.php?mod=viewthread&tid=11218&from=portal

## 2、关于 json-rpc

基于 json-rpc 2.0协议，参考：http://www.jsonrpc.org/specification
并增加要求，如果使用params指定了调用远程函数的参数，那么params必须是1个或多个参数组成的数组。

## 3、aasdl

json-rpc请求的方法名为"?"号，以及rest-rpc请求的资源名"aasdl"时，服务器以JSON返回支持的所有远程函数描述。

aasdl返回的是一个JSON对象，如果对象存在指定名字的方法，那么他在该对象中的值为1，如果存在指定名字的子对象，那么他的值是一个嵌套的JSON对象，示例：
```json
{
    "method":1,
    "method2":1,
    "object":{
        "method":1,
        "method2":1
    }
}
```

aasdl中的值只能是1或者对象,服务端不得在aasdl中包含其他值。

经过rpc协议解析aasdl必须仍然是一个字符串值，例如在json-rpc实现中result字段中返回的aasdl应当是一个json字符串，而不是一个对象。

    附注：aardio并不需要aasdl就可以支持此特性，但aardio中的RPC服务端实现了aasdl，
