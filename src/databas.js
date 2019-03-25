const mysql = require('mysql');

const util = {
  connection() {
    var connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : '123456',
      database : 'stock'
    });
    connection.connect();

    return connection
  }
}

const database = util.connection()

module.exports = database





// INSERT record (stock_code, stock_name, update_time) VALUES(12345, '股票1', '123123123');
// SELECT * FROM record;