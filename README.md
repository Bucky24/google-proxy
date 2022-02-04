You must have an ssl cert:

brew install mkcert
mkdir cert
cd cert
mkcert -install
mkcert localhost

The cert folder is gitignored so it's safe to put here.

Start the server with 

KEY=./cert/localhost-key.pem CERT=./cert/localhost.pem npm start

Change the places that you use google auth to point to localhost instead of google.

You should be replacing calls to accounts.google.com and https://www.googleapis.com/oauth2/v1/certs

Now your code will use your local server instead of google auth.