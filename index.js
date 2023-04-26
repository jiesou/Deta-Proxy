import express from 'express';
import fetch from 'node-fetch';

var app = express();


function throwRequest(res, error) {
    res.status(500).json({
      code: 500,
      message: `PROXY ERROR: ${error}`
    });
}

app.all('*', async (req, res) => {
    // remove first slash
    let url = req.path.substr(1);
    if (!url) throwRequest(res, 'nullValue');

    // add http:// and limit :// number of slashes
    url = url.replace(/^(http(s?):\/+)?/, 'http$2://');
    const req_headers = req.headers;
    // remove referer in headers
    if (req_headers['referer']) delete req_headers['referer'];
    // turn headers.host into the host of target
    req_headers['host'] = new URL(url).host;
    
    try {
        const response = await fetch(url, {
          method: req.method,
          headers: req_headers,
          body: req.body
        });
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
