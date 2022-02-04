const express = require('express');
const https = require('https');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const app = express();
const port = 443;

const key = process.env.KEY;
const cert = process.env.CERT;

if (!key || !cert) {
    console.log("Program requires the KEY and CERT env variables to be set");
    process.exit(1);
}

const options = {
  key: fs.readFileSync(key),
  cert: fs.readFileSync(cert),
};

app.get('/o/oauth2/auth', (req, res) => {
    console.log('got request for auth');
    //console.log(req.query);
    
    const redirect = req.query.redirect_uri;
    
    const scope = req.query.scope;
    
    const newScope = scope + 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';
    
    let code = 'abadcode';
    
    const params = {
        state: req.query.state,
        hd: req.query.hd,
        scope: newScope,
        code,
    };
    
    const urlList = Object.keys(params).map((key) => {
        let value = encodeURIComponent(params[key]);
        value = value.replace(/ /g, "+");
        
        return `${key}=${value}`;
    });
    
    const paramString = urlList.join("&");
    
    const resultUrl = redirect + "?" + paramString;
    
    // redirect
    res.status(302);
    res.set("Location", resultUrl);
    res.end();
});

app.post('/o/oauth2/token', (req, res) => {
    console.log('got request for token');
    const token = jwt.sign({
        hd: '<your domain here>',
        email: '<your email here>',
        email_verified: 'true',
    }, options.key.toString(), {
        //algorithm: 'RS256',
        header: {
            alg: 'RS256',
            kid: '12345',
        },
    });
    res.send(JSON.stringify({
        'id_token': token,
    }));
});

app.get('/oauth2/v1/certs', (req, res) => {
    console.log('got request for certs');
    res.send(JSON.stringify({
        '12345': options.cert.toString(),
    }));
});

https.createServer(options, app).listen(port, () => {
     console.log(`Example app listening on port ${port}`)
});