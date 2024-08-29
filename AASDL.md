# aardio 服务接口描述语言（AASDL）

因为 js 语言不能像 aardio 那样将 REST-RPC,JSON-RPC 提供的远程函数自动转换为 JS 中的函数对象，aardio 制定出 AASDL 使我们在 JS 语言中可以将 aardio 提供的服务端函数自动转换为  JS 中的函数对象。

## 关于 REST-RPC

在 aardio 中的实现为标准库中的 web.rest，可以将任何第三方的普通 HTTP API 轻松的转换为 aardio 中的函数对象。参考：http://aardio.com/doc/library%20guide/std/web/rest/client.md

## 关于 JSON-RPC

基于 JSON-RPC 2.0协议，参考：http://www.jsonrpc.org/specification
并增加要求: 如果使用 params 指定了调用远程函数的参数，那么 params 必须是1个或多个参数组成的数组。

## AASDL

JSON-RPC 请求的方法名为"?"号，以及 REST-RPC 请求的资源名"aasdl"时，服务器以 JSON 返回支持的所有远程函数描述。

AASDL 返回的是一个 JSON 对象，如果对象存在指定名字的方法，那么他在该对象中的值 为1，如果存在指定名字的子对象，那么他的值是一个嵌套的JSON对象，示例：

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

AASDL 中的值只能是 1 或者对象,服务端不得在 AASDL 中包含其他值。

经过 RPC 协议解析 AASDL 必须仍然是一个字符串值，例如在 JSON-RPC 实现中 result 字段中返回的 AASDL 应当是一个 JSON 字符串，而不是一个对象。

附注：aardio 并不需要 AASDL 就可以支持此特性，但 aardio 中的 RPC 服务端自动支持 AASDL，
JS 客户端参考 aardio.js  源码。
