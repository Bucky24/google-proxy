You must have an ssl cert:

brew install mkcert
mkdir cert
cd cert
mkcert -install
mkcert localhost

The cert folder is gitignored so it's safe to put here.

Start the server with 

KEY=./cert/localhost-key.pem CERT=./cert/localhost.pem npm start

Start ngrok:

ngrok http 443

Change the places that you use google auth to point to ngrok instead of google.

Now as long as your using the dev env, slack will use your local server instead of google auth.