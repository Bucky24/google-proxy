You must have an ssl cert:

```
brew install mkcert
mkdir cert
cd cert
mkcert -install
mkcert localhost
```

The cert folder is gitignored so it's safe to put here.

The following env variables are expected:
| Key | Description |
| -- | -- |
| KEY_FILE | Path to a file containing the key for a self-signed cert |
| CERT_FILE | Path to a fiel containing the public cert for a self-signed cert |
| PORT | The port to run the server on |
| DOMAIN | The Google domain to emulate |
| EMAIL | The email to use when returning user data |

Only KEY_FILE, CERT_FILE, and PORT are required.

Start the server with 
```
KEY_FILE=./cert/localhost-key.pem CERT_FILE=./cert/localhost.pem PORT=8080 npm start
```

Change the places that you use google auth to point to localhost instead of google.

You should be replacing calls to `accounts.google.com` and `www.googleapis.com` whenever it's referencing `oauth2/v1/certs`

Now your code will use your local server instead of google auth.