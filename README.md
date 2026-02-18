# Pixelrest
Make API REST on node.js

## Get started

Install pixelrest with npm:
```
npm install --save pixelrest
```

Generate a project pixelrest:
```
pixelrest-new
```

Set your node project in ES module mode, add the following property to your package.json file:
```json
"type": "module"
```

### Database

Pixelrest supports **MySQL/MariaDB** and **PostgreSQL**.

#### MySQL / MariaDB
Create a MySQL/MariaDB database (InnoDB).

#### PostgreSQL
Create a PostgreSQL database.

### Configuration

Create file `secret.js` in `app/config` with your database credentials and JWT secret.

MySQL example:
```js
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

PostgreSQL example:
```js
export const DB_CREDENTIALS = {
  DATABASE: 'mydatabase',
  HOST: 'localhost',
  PORT: 5432,
  USERNAME: 'postgres',
  PASSWORD: 'password'
};

export const JWT = {
  SECRET: 'mysecret',
  EXPIRES_IN: 14400
};
```

### Prepare and run

Prepare your database with the script:
```
node ./app/scripts/prepareDatabase.js
```

Start your server:
```
npm start
```

Test your API REST with swagger:
```
http://localhost:1338/api-docs
```

Before testing the documents service, don't forget to create the `documents` directory in your project.

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the server with nodemon |
| `npm test` | Run tests with Vitest |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Run ESLint |
| `npm run prepare-file` | Prepare database tables |

## CLI

The `pixelrest-new` command generates a ready-to-use project structure with example services, repositories, and configuration files.

```
npx pixelrest-new
```

## Security
Never push `secret.js` on your git. You should add it to your `.gitignore`!
