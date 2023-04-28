import express from 'express';
import fetch from 'node-fetch';

var app = express();


function throwRequest(res, error) {
    res.status(500).json({
      code: 500,
      message: `PROXY ERROR: ${error}`
    });
}

app.disable('x-powered-by');

app.all('*', (req, res) => {
    // remove first slash
    let req_url = req.path.substr(1);
    if (!req_url) throwRequest(res, 'nullValue');

    // add http:// and limit :// number of slashes
    req_url = req_url.replace(/^(http(s?):\/+)?/, 'http$2://');
    const req_headers = req.headers;
    // remove referer in headers
    if (req_headers['referer']) delete req_headers['referer'];
    // turn headers.host into the host of target
    req_headers['host'] = new URL(req_url).host;

    /* special list */
    if (req_headers['host'] === "i.pximg.net") {
      req_headers['referer'] = "https://www.pixiv.net";
    }
    
    try {
      let req_body = '';
      // body in request
      req.on('data', (chunk) => {
        req_body += chunk;
      });
      req.on('end', async () => {
        const response = await fetch(req_url, {
          method: req.method,
          headers: req_headers,
          body: req_body
        });
        res.status(response.status);
        // body in response
        response.body.pipe(res);
      });
    } catch (e) {
      throwRequest(res, e);
    }
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.debug('Server listening on port', port);
});
