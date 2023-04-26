import express from 'express';
import fetch from 'node-fetch';

var app = express();


function throwRequest(res, error) {
    res.status(500)
        .end('<!DOCTYPE html>PROXY ERROR: ' + error + '<br>Please refer the doc: https://loliis.top/proxy.html#通用');
}

app.all('*', async (req, res) => {
    //去掉路径斜线
    let url = req.path.substr(1);
    if (!url) {
        throwRequest(res, 'nullValue');
    }
    //添加 http:// 统一 :// 的斜线数量
    url = url.replace(/^(http(s?):\/+)?/, 'http$2://');
    console.log(url)
    const req_headers = req.headers;
    //请求的 headers 去掉 referer
    if (req_headers['referer']) {
        delete req_headers['referer'];
    }
    //请求 headers host 里的 proxy.gfwin.icu 改成代理的链接域名
    req_headers['host'] = new URL(url).host;
    
    try{
        const response = await fetch(url, {
          method: req.method,
          headers: req_headers,
          body: req.body
        })
        if (!response.ok) {
          throwRequest(res, "request error: " + response.status);
        }
        //添加响应的 headers
        res.writeHead(response.status, response.headers);
        response.body.pipe(res);
    } catch (e) {
        throwRequest(res, "fetch error:" + e);
    }
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.debug('Server listening on port', port);
});
