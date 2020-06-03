const mysql = require('mysql');

const util = {
  connection() {
    var connection = mysql.createConnection({
      host     : '106.53.236.9',
      user     : 'root',
      password : 'abc123',
      database : 'ymxf'
    });
    connection.connect();

    return connection
  }
}

const database = util.connection()

module.exports = database





// INSERT record (stock_code, stock_name, update_time) VALUES(12345, '股票1', '123123123');
// SELECT * FROM record;