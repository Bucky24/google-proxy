const express = require('express');
const http = require('http');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const app = express();

const key = process.env.KEY_FILE;
const cert = process.env.CERT_FILE;
const port = process.env.PORT;
const domain = process.env.DOMAIN;
const email = process.env.EMAIL;

if (!key || !cert) {
    console.log("Program requires the KEY_FILE and CERT_FILE env variables to be set");
    process.exit(1);
}

const options = {
  key: fs.readFileSync(key),
  cert: fs.readFileSync(cert),
};

app.get("/", (req, res) => {
    res.status(200);
    res.write("OK");
    res.end();
});

// v1 routes
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
        hd: domain || 'sampledomain.com',
        email: email || 'test@sampledomain.com',
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

// v2 routes
app.get('/o/oauth2/v2/auth', (req, res) => {
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

app.post('/token', (req, res) => {
    console.log('got request for token');
    const token = jwt.sign({
        hd: domain || 'sampledomain.com',
        email: email || 'test@sampledomain.com',
        email_verified: 'true',
    }, options.key.toString(), {
        //algorithm: 'RS256',
        header: {
            alg: 'RS256',
            kid: '12345',
        },
    });
    res.send(JSON.stringify({
        'access_token': '1234',
        'id_token': token,
        'expires_in': 100000,
        'token_type': 'access_token',
    }));
});

http.createServer(app).listen(port, () => {
     console.log(`Example app listening on port ${port}`)
});
