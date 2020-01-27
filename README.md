# pg-crud

> Library for simplifying crud (Create, Retrieve, Update, Delete) operations on postgres (psql) database, and can be used to scaffold restAPI implementations.

## Including pg-crud

A pre-requisite for this package to work is to have [PostgreSQL](https://www.postgresql.org/) already setup and available on the network.  Also a database must be created to put the log information into.

```sh
npm install pg-crud --save
```

## Usage

### Import the pg-crud module

```js
const crud = require('pg-crud');
```

### API

#### constructor

```
crud(config, table)
```

Create a new pg-crud tool using `config` and `table` variables.

##### Arguments

###### config

This variable will hold the connection information to the postgres database.  There are 2 options for defining the variable:

1. Using a connection string as follows:

  ```js
  const config = {
    connectionString: 'postgresql://dbuser:secretpassword@database.server.com:3211/mydb'
  };
  ```

2. Use the connection information as follows:

  ```js
  const config = {
    user: 'dbuser',
    host: 'database.server.com',
    database: 'mydb',
    password: 'secretpassword',
    port: 3211,
  };
  ```

###### table

This string represents the table name for the data.  If the table holds data about people and example would be to use the following:

```js
const table = 'person';
```

###### Example

An example to setup the tool using the person table:

```js
const personCrud = crud({
  connectionString: 'postgresql://dbuser:secretpassword@database.server.com:3211/mydb'
}, 'person');
```

#### create

```
personCrud.create(data);
```

##### Arguments

###### data

This object represents the item to be stored in the database.  An example of the data object as a person could look like:

```js
{
  name: 'Test',
  email: '123@456.com'
}
```

###### Example

To include this into an API for post call, the implementation could be as simple as:

```js
router.post("/", (req, res) => {
  const data = req.body;
  db.create(data)
    .then(result => {
      res.json(result);
    }, err => res.status(400).json(err));
});
```

#### retrieve

```
personCrud.retrieve(opts);
```

##### Arguments

###### opts

This object may consist of find, sort, limit, and skip.  The default values for `limit` is `1000` and `skip` is `0`.  The find items go into the where clause and the sort items go into the order by.  An example of the options object is:

```js
{
  find: ["name <> 'john'"],
  sort: ['email DESC', 'name'],
  limit: 100,
	skip: 1
}
```

###### Example

```js
router.get('/', (req, res) => {
  const opts = {
    sort: ['name']
  };
  db.retrieve(opts)
    .then(result => {
      res.json(result);
    }, err => {
      res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  const opts = {
    find: [`id=${id}`]
  };
  db.retrieve(opts)
    .then(result => {
      if(result.length === 1) {
        return res.json(result[0]);
      } else {
        return res.status(404).json(`${id} Not found`);
      }
    }, err => {
      res.status(500).json(err);
    });
});
```

#### update

```
personCrud.update(id, data);
```

##### Arguments

###### id

The number id for the item that is to be modified.

```js
1
```

###### data

This object represents the item to be stored in the database.  An example of the data object as a person could look like:

```js
{
  name: 'Test',
  email: '123@456.com'
}
```

###### Example

To include this into an API for post call, the implementation could be as simple as:

```js
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const data = req.body;
  db.update(id, data)
    .then(result => {
      res.json(result);
    }, err => res.status(400).json(err));
});
```

#### delete

```
personCrud.delete(id);
```

##### Arguments

###### id

The number id for the item that is to be modified.

```js
1
```

###### Example

To include this into an API for post call, the implementation could be as simple as:

```js
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  db.delete(id)
    .then(result => {
      res.json(result);
    }, err => res.status(400).json(err));
});
```

### Examples

#### Basic Example - person

```js
const crud = require('pg-crud');
const personCrud = crud({
  connectionString: 'postgresql://dbuser:secretpassword@database.server.com:3211/mydb'
}, 'person');

const express = require('express');
const router = express.Router();
const app = express();

router.post("/", (req, res) => {
  const data = req.body;
  db.create(data)
    .then(result => {
      res.json(result);
    }, err => res.status(400).json(err));
});

router.get('/', (req, res) => {
  const opts = {
    sort: ['name']
  };
  db.retrieve(opts)
    .then(result => {
      res.json(result);
    }, err => {
      res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  const opts = {
    find: [`id=${id}`]
  };
  db.retrieve(opts)
    .then(result => {
      if(result.length === 1) {
        return res.json(result[0]);
      } else {
        return res.status(404).json(`${id} Not found`);
      }
    }, err => {
      res.status(500).json(err);
    });
});

router.put('/:id', (req, res) => {
  const id = req.params.id;
  const data = req.body;
  db.update(id, data)
    .then(result => {
      res.json(result);
    }, err => res.status(400).json(err));
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  db.delete(id)
    .then(result => {
      res.json(result);
    }, err => res.status(400).json(err));
});

app.use('/api/v1/person', router);

app.listen(8080);
```

## Contributors

[Randall Simpson](https://www.linkedin.com/in/randall-simpson-356a9111b/)

## License

The MIT License (MIT)

Copyright (c) 2020 Randall Simpson

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
