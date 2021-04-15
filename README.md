# Pixelrest
Make API REST on node.js

# Get started
Install pixelrest with npm : <br>
`npm install --save pixelrest` <br><br>
Generate a project pixelrest : <br>
`pixelrest-new` <br><br>
Set your node projet in ES module mode, add following property to your package.json file :<br>
`"type": "module"`<br><br>
You should make a mysql/mariadb database(InnoDB)<br><br>
Create file secret.js in `app/config` with your mysql server and database credentials.<br>
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
Prepare your database with the script prepareDatabase :<br>
`node ./app/scripts/prepareDatabase.js` <br>

Start your server : <br>
`nodemon ./main.js` <br>

Test your API REST with swagger : <br>
`http://localhost:1338/api-docs` <br>

Before testing documents service, don't forget to create documents directory in your projet

# SECURITY
Never push secret.js on your git. You should add it to your gitignore!
