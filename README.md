# Pixelrest
Make API REST on node.js

# Get started
Install pixelrest with npm : <br>
`npm install --save pixelrest` <br><br>
Generate a project pixelrest : <br>
`pixelrest-new` <br><br>
Create file secret.js in `app/config` with the credentials.<br><br>
Secret.js file example:<br>

```
export const DB_CREDENTIALS = {
  DATABASE: 'mydatabase',
  HOST: 'localhost',
  PORT: 3306,
  USERNAME: 'root',
  PASSWORD: 'password'
};

export const JWT = {
  SECRET: 'mysecret',
  EXPIRES_IN: 14400
};
```

Start your server : <br>
`nodemon ./app/main.js` <br>

Test your API REST with swagger : <br>
`http://localhost:1338/api-docs` <br>

# SECURITY
Never push secret.js on your git.
