/*!
 * pg-crud
 * Copyright(c) 2020 Randall Simpson
 * MIT Licensed

 * (The MIT License)
 * Copyright (c) 2020 Randall Simpson <chipdawg112@msn.com>

 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * 'Software'), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:

 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

'use strict'

const { Pool } = require('pg');

module.exports = psqlCrud;
module.exports.create = create;
module.exports.retrieve = retrieve;
module.exports.update = update;
module.exports.delete = delete;

function psqlCrud(config, table) {
    var cfg = config || {}

    // setup the connection pool
    const pool = new Pool({
      connectionString: opts.url
    });

    const pool = new Pool({
      user: 'dbuser',
      host: 'database.server.com',
      database: 'mydb',
      password: 'secretpassword',
      port: 3211,
    });
    psqlCrud['pool'] = pool;

    psqlCrud['table'] = opts.table;
};

function create(data) => {
  return new Promise((resolve, reject) => {
    //add created and moditifed.
    data.created = new Date();
    data.modified = new Date();
    //item is object that has all the values to insert into db.
    const colNames = [];
    const values = [];
    for (const key in data) {
      //check for null
      if(data[key]) {
        //sql cannot have - needs to be _
        colNames.push(key);
        values.push(data[key]);
      }
    }
    let sqlbuilder = "";
    for(let i = 1; i <= colNames.length; i++) {
      sqlbuilder += "$" + i + ", ";
    }
    sqlbuilder = sqlbuilder.substr(0, sqlbuilder.length - 2);
    const sql = `INSERT INTO ${psqlCrud['table']} ( ${colNames.join(", ")} ) VALUES ( ${sqlbuilder} );`;
    const pool = psqlCrud['pool'];
    pool.query(sql, values, (err, res) => {
      if(err) {
        return reject({
          sql,
          err
        });
      }
      resolve(res);
    }, err => reject({
      sql,
      err
    }));
  });
};

function retrieve(opts) => {
  return new Promise((resolve, reject) => {
    const find = opts.find || [];
    const sort = opts.sort || [];
    const limit = opts.limit || 1000;
    const skip = opts.skip || 0;

    const where = find.length > 0 ? " WHERE " + find.join(" AND ") : "";
    const orderBy = sort.length > 0 ? " ORDER BY " + sort.join(", ") : "";

    const sql = `SELECT * FROM ${psqlCrud['table']} ${where} ${orderBy} LIMIT ${limit} OFFSET ${skip};`;
    const pool = psqlCrud['pool'];
    pool.query(sql, (err, res) => {
      if(err) {
        return reject({
          sql,
          err
        });
      }
      resolve(res.rows);
    }, err => reject({
      sql,
      err
    }));
  });
};

function update(id, data) => {
  return new Promise((resolve, reject) => {
    delete data.created;
    delete data.id;
    data.modified = new Date();
    //item is object that has all the values to insert into db.
    const colNames = [];
    const values = [];
    for (const key in data) {
      //check for null
      if(data[key]) {
        //sql cannot have - needs to be _
        colNames.push(key);
        values.push(data[key]);
      }
    }
    let sqlbuilder = "";
    for(let i = 1; i <= colNames.length; i++) {
      sqlbuilder += colNames[i - 1] + " = $" + i + ", ";
    }
    sqlbuilder = sqlbuilder.substr(0, sqlbuilder.length - 2);
    const sql = `UPDATE ${psqlCrud['table']} SET ${sqlbuilder} WHERE id=${id};`;
    const pool = psqlCrud['pool'];
    pool.query(sql, (err, res) => {
      if(err) {
        return reject({
          sql,
          err
        });
      }
      resolve(res.rows);
    }, err => reject({
      sql,
      err
    }));
  });
};

function delete(id) => {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM ${psqlCrud['table']} WHERE id=${id};`;
    const pool = psqlCrud['pool'];
    pool.query(sql, (err, res) => {
      if(err) {
        return reject({
          sql,
          err
        });
      }
      resolve(res);
    }, err => reject({
      sql,
      err
    }));
  });
};
